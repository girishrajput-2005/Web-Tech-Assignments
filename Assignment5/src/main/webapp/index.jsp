<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<%
    String unitsInput = request.getParameter("units");

    double bill = 0;
    boolean calculated = false;
    String error = "";

    if (unitsInput != null && !unitsInput.trim().isEmpty()) {

        try {
            double units = Double.parseDouble(unitsInput);

            if (units < 0) {
                error = "Units cannot be negative.";
            }
            else {

                if (units <= 50) {

                    bill = units * 3.50;

                }
                else if (units <= 150) {

                    bill = (50 * 3.50)
                         + ((units - 50) * 4.00);

                }
                else if (units <= 250) {

                    bill = (50 * 3.50)
                         + (100 * 4.00)
                         + ((units - 150) * 5.20);

                }
                else {

                    bill = (50 * 3.50)
                         + (100 * 4.00)
                         + (100 * 5.20)
                         + ((units - 250) * 6.50);
                }

                calculated = true;
            }

        }
        catch (NumberFormatException e) {

            error = "Please enter a valid number.";
        }
    }
%>

<!DOCTYPE html>

<html>

<head>

    <meta charset="UTF-8">

    <title>Electricity Bill Calculator</title>

    <link rel="stylesheet" href="style.css">

</head>

<body>

    <div class="container">

        <div class="card">

            <h1>⚡ Electricity Bill Calculator</h1>

            <p class="subtitle">
                Calculate your electricity bill
            </p>

            <form method="post" action="index.jsp">

                <label for="units">
                    Enter Electricity Units
                </label>

                <input
                    type="number"
                    id="units"
                    name="units"
                    placeholder="Enter units"
                    min="0"
                    step="0.01"
                    required
                >

                <button type="submit">
                    Calculate Bill
                </button>

            </form>

            <% if (!error.isEmpty()) { %>

                <div class="error">
                    <%= error %>
                </div>

            <% } %>


            <% if (calculated) { %>

                <div class="result">

                    <h2>Bill Amount</h2>

                    <div class="amount">
                        ₹ <%= String.format("%.2f", bill) %>
                    </div>

                    <p>
                        Electricity consumption:
                        <strong><%= unitsInput %> units</strong>
                    </p>

                </div>

            <% } %>


            <div class="rates">

                <h3>Electricity Rates</h3>

                <div class="rate-row">
                    <span>First 50 units</span>
                    <span>₹3.50 / unit</span>
                </div>

                <div class="rate-row">
                    <span>Next 100 units</span>
                    <span>₹4.00 / unit</span>
                </div>

                <div class="rate-row">
                    <span>Next 100 units</span>
                    <span>₹5.20 / unit</span>
                </div>

                <div class="rate-row">
                    <span>Above 250 units</span>
                    <span>₹6.50 / unit</span>
                </div>

            </div>

        </div>

    </div>

</body>

</html>