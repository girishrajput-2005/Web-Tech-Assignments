<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.List" %>
<%@ page import="com.assignment4.ElectricityBillServlet.BillLine" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bill Result | Electricity Calculator</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="<%= request.getContextPath() %>/css/style.css">
</head>
<body>
    <main class="container py-5">
        <div class="row justify-content-center">
            <div class="col-lg-9">
                <section class="result-panel">
                    <p class="eyebrow">Calculation Complete</p>
                    <h1>Your Electricity Bill</h1>
                    <p class="text-secondary">Units consumed: <strong><%= request.getAttribute("units") %> kWh</strong></p>

                    <div class="table-responsive mt-4">
                        <table class="table align-middle">
                            <thead><tr><th>Slab</th><th>Units Charged</th><th>Rate</th><th class="text-end">Amount</th></tr></thead>
                            <tbody>
                            <% List<BillLine> lines = (List<BillLine>) request.getAttribute("billLines"); %>
                            <% for (BillLine line : lines) { %>
                                <tr>
                                    <td><%= line.getSlab() %></td>
                                    <td><%= line.getUnits() %></td>
                                    <td>₹<%= line.getRate() %></td>
                                    <td class="text-end">₹<%= line.getAmount() %></td>
                                </tr>
                            <% } %>
                            </tbody>
                        </table>
                    </div>

                    <div class="total-row mt-3">
                        <span>Total Bill</span>
                        <strong>₹<%= request.getAttribute("total") %></strong>
                    </div>
                    <a class="btn btn-outline-primary mt-4" href="<%= request.getContextPath() %>/index.jsp">Calculate Again</a>
                </section>
            </div>
        </div>
    </main>
</body>
</html>
