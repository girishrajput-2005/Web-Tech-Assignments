<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Electricity Bill Calculator</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="<%= request.getContextPath() %>/css/style.css">
</head>
<body>
    <main class="container py-5">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <section class="calculator-panel">
                    <div class="intro mb-4">
                        <p class="eyebrow">Assignment 4</p>
                        <h1>Electricity Bill Calculator</h1>
                        <p class="text-secondary mb-0">Enter your monthly electricity consumption to calculate the bill.</p>
                    </div>

                    <% String error = (String) request.getAttribute("error"); %>
                    <% if (error != null) { %>
                        <div class="alert alert-danger" role="alert"><%= error %></div>
                    <% } %>

                    <form action="<%= request.getContextPath() %>/calculate-bill" method="post">
                        <label for="units" class="form-label fw-semibold">Units Consumed</label>
                        <div class="input-group input-group-lg mb-3">
                            <input type="number" class="form-control" id="units" name="units"
                                   min="0" step="any" placeholder="e.g. 180" required
                                   value="<%= request.getAttribute("units") == null ? "" : request.getAttribute("units") %>">
                            <span class="input-group-text">kWh</span>
                        </div>
                        <div class="form-text mb-4">Use a non-negative number. The calculation is performed by the server.</div>
                        <button type="submit" class="btn btn-primary btn-lg w-100">Calculate Bill</button>
                    </form>
                </section>

                <section class="slab-guide mt-4">
                    <h2>Rate Slabs</h2>
                    <div class="table-responsive">
                        <table class="table align-middle mb-0">
                            <thead><tr><th>Units</th><th>Rate per unit</th></tr></thead>
                            <tbody>
                                <tr><td>First 50</td><td>₹3.50</td></tr>
                                <tr><td>Next 100</td><td>₹4.00</td></tr>
                                <tr><td>Next 100</td><td>₹5.20</td></tr>
                                <tr><td>Above 250</td><td>₹6.50</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    </main>
</body>
</html>
