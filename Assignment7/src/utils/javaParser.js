import { genId } from "./idGen";

// ─── Strip comments from Java source ────────────────────────────────────────
function stripComments(src) {
  // Remove block comments /* ... */
  src = src.replace(/\/\*[\s\S]*?\*\//g, "");
  // Remove line comments // ...
  src = src.replace(/\/\/[^\n]*/g, "");
  return src;
}

// ─── Extract top-level class/interface/enum blocks ───────────────────────────
function splitClassBlocks(src) {
  const blocks = [];
  // Match class/interface/enum declaration including its body
  const declRe = /(?:(?:public|private|protected|abstract|final|static)\s+)*(?:class|interface|enum)\s+\w+[^{]*\{/g;
  let m;
  while ((m = declRe.exec(src)) !== null) {
    // Find matching closing brace
    let depth = 0;
    let start = m.index;
    let i = m.index + m[0].length - 1; // points to opening {
    for (; i < src.length; i++) {
      if (src[i] === "{") depth++;
      else if (src[i] === "}") {
        depth--;
        if (depth === 0) break;
      }
    }
    blocks.push(src.slice(start, i + 1));
  }
  return blocks;
}

// ─── Parse a single class block ──────────────────────────────────────────────
const CLASS_DECL_RE =
  /(?:(public|private|protected)\s+)?(?:(abstract|final)\s+)?(?:(static)\s+)?(class|interface|enum)\s+(\w+)(?:\s+extends\s+([\w<>,\s]+?))?(?:\s+implements\s+([\w<>,\s]+?))?\s*\{/;

function parseClassBlock(block) {
  const declMatch = block.match(CLASS_DECL_RE);
  if (!declMatch) return null;

  const [, , modifier, , keyword, name, extendsRaw, implementsRaw] = declMatch;

  let stereotype = "class";
  if (keyword === "interface") stereotype = "interface";
  else if (keyword === "enum")  stereotype = "enum";
  else if (modifier === "abstract") stereotype = "abstract";

  const extendsNames  = extendsRaw   ? extendsRaw.split(",").map(s => s.trim().replace(/<.*>/, "")).filter(Boolean) : [];
  const implementsNames = implementsRaw ? implementsRaw.split(",").map(s => s.trim().replace(/<.*>/, "")).filter(Boolean) : [];

  // Get body (between first { and last })
  const bodyStart = block.indexOf("{") + 1;
  const bodyEnd   = block.lastIndexOf("}");
  const body = block.slice(bodyStart, bodyEnd);

  let fields  = [];
  let methods = [];

  if (stereotype === "enum") {
    // Enum constants: first non-method identifiers before first ; or method
    const enumBody = body.split(/[;{]/)[0];
    const constants = enumBody
      .split(",")
      .map(s => s.trim())
      .filter(s => /^[A-Z_][A-Z0-9_]*(\(.*\))?$/.test(s));
    fields = constants.map(c => ({
      id: genId(),
      visibility: "public",
      name: c.replace(/\(.*\)/, ""),
      type: "",
      defaultValue: "",
    }));
  } else {
    // Parse fields and methods
    const members = parseMembers(body);
    fields  = members.fields;
    methods = members.methods;
  }

  return { name, stereotype, extendsNames, implementsNames, fields, methods };
}

// ─── Visibility mapper ────────────────────────────────────────────────────────
function mapVis(v) {
  if (!v || v === "") return "package";
  return v; // public / private / protected
}

// ─── Parse members (fields + methods) from class body ────────────────────────
function parseMembers(body) {
  const fields  = [];
  const methods = [];

  // Remove inner class/interface blocks to avoid false matches
  body = body.replace(/(?:class|interface|enum)\s+\w+[^{]*\{[^}]*\}/g, "");

  // Method pattern: [visibility] [modifiers] returnType name(params) [{...}|;]
  const methodRe = /\b(public|private|protected)?\s*(abstract|static|final|synchronized|native)?\s*((?:[\w<>\[\],\s]+?))\s+(\w+)\s*\(([^)]*)\)\s*(?:throws\s+[\w,\s]+)?\s*(?:\{[^}]*\}|;)/g;

  // Field pattern: [visibility] [modifiers] type name [= val];
  const fieldRe = /\b(public|private|protected)?\s*(static\s+)?(final\s+)?([\w<>\[\]]+(?:\s*<[^>]*>)?)\s+(\w+)\s*(?:=[^;,{(]*)?;/g;

  // Collect method ranges first so we can exclude them from field detection
  const methodRanges = [];
  let mm;
  while ((mm = methodRe.exec(body)) !== null) {
    const [full, vis, mod, returnType, name, params] = mm;
    // Skip constructor-like patterns (returnType matches name)
    if (returnType.trim() === name) continue;
    // Skip common keywords that slip through
    if (["if", "for", "while", "switch", "catch", "return"].includes(name)) continue;
    const cleanReturn = returnType.trim().replace(/\s+/g, " ");
    const isAbstract = (mod || "").includes("abstract");
    const parsedParams = parseParams(params);
    methods.push({
      id: genId(),
      visibility: mapVis(vis),
      name,
      params: parsedParams,
      returnType: cleanReturn,
      isAbstract,
    });
    methodRanges.push([mm.index, mm.index + full.length]);
  }

  fieldRe.lastIndex = 0;
  let fm;
  while ((fm = fieldRe.exec(body)) !== null) {
    // Skip if inside a method range
    const inMethod = methodRanges.some(([s, e]) => fm.index >= s && fm.index < e);
    if (inMethod) continue;
    const [full, vis, , , type, name] = fm;
    if (["class", "interface", "enum", "return", "new"].includes(name)) continue;
    if (["void", "if", "else", "for", "while"].includes(type)) continue;
    fields.push({
      id: genId(),
      visibility: mapVis(vis),
      name,
      type: type.trim(),
      defaultValue: "",
    });
  }

  return { fields, methods };
}

// ─── Parse parameter list "String name, int age" ─────────────────────────────
function parseParams(raw) {
  if (!raw || !raw.trim()) return [];
  return raw.split(",").map(p => {
    p = p.trim();
    const parts = p.split(/\s+/);
    if (parts.length < 2) return null;
    const name = parts[parts.length - 1];
    const type = parts.slice(0, -1).join(" ").replace(/final\s+/, "");
    if (!name || !type) return null;
    return { id: genId(), name, type };
  }).filter(Boolean);
}

// ─── Auto-layout: arrange classes in a layered grid ─────────────────────────
function autoLayout(classNames, relationships) {
  const positions = {};
  const COL_W = 260, ROW_H = 300;
  const COLS = Math.max(1, Math.ceil(Math.sqrt(classNames.length)));

  classNames.forEach((name, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    positions[name] = { x: 60 + col * COL_W, y: 60 + row * ROW_H };
  });
  return positions;
}

// ─── Main entry: parse Java source → diagram data ────────────────────────────
export function parseJavaCode(source) {
  const cleaned = stripComments(source);
  const blocks  = splitClassBlocks(cleaned);

  if (blocks.length === 0) {
    throw new Error("No class, interface, or enum declarations found. Make sure your code includes at least one class.");
  }

  const parsed = blocks.map(parseClassBlock).filter(Boolean);
  const classNames = new Set(parsed.map(c => c.name));

  // Build classes
  const classMap = {};
  const classes = parsed.map(p => {
    const cls = {
      id: genId(),
      name: p.name,
      stereotype: p.stereotype,
      position: { x: 0, y: 0 }, // set below
      fields: p.fields,
      methods: p.methods,
      _extends: p.extendsNames,
      _implements: p.implementsNames,
    };
    classMap[p.name] = cls;
    return cls;
  });

  // Auto-layout
  const positions = autoLayout(classes.map(c => c.name), []);
  classes.forEach(c => { c.position = positions[c.name]; });

  // Build relationships
  const relationships = [];

  for (const cls of classes) {
    // Inheritance (extends)
    for (const parent of (cls._extends || [])) {
      const target = classMap[parent];
      if (target) {
        relationships.push({
          id: genId(),
          type: "inheritance",
          sourceId: cls.id,
          targetId: target.id,
          label: "",
          sourceMultiplicity: "",
          targetMultiplicity: "",
        });
      }
    }

    // Implementation (implements)
    for (const iface of (cls._implements || [])) {
      const target = classMap[iface];
      if (target) {
        relationships.push({
          id: genId(),
          type: "implementation",
          sourceId: cls.id,
          targetId: target.id,
          label: "",
          sourceMultiplicity: "",
          targetMultiplicity: "",
        });
      }
    }

    // Aggregation from field types that match other classes
    for (const field of cls.fields) {
      const rawType = field.type.replace(/[\[\]]/g, "").split("<")[0].trim();
      if (classNames.has(rawType) && rawType !== cls.name) {
        const target = classMap[rawType];
        // Only add if no inheritance/impl already
        const alreadyLinked = relationships.some(
          r => r.sourceId === cls.id && r.targetId === target.id
        );
        if (!alreadyLinked && target) {
          relationships.push({
            id: genId(),
            type: field.visibility === "private" ? "composition" : "aggregation",
            sourceId: cls.id,
            targetId: target.id,
            label: field.name,
            sourceMultiplicity: "1",
            targetMultiplicity: "1",
          });
        }
      }
    }

    // Clean up internal props
    delete cls._extends;
    delete cls._implements;
  }

  return { classes, relationships };
}
