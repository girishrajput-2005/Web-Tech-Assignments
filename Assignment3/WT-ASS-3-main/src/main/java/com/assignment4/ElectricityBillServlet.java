package com.assignment4;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/calculate-bill")
public class ElectricityBillServlet extends HttpServlet {
    private static final BigDecimal FIRST_RATE = new BigDecimal("3.50");
    private static final BigDecimal SECOND_RATE = new BigDecimal("4.00");
    private static final BigDecimal THIRD_RATE = new BigDecimal("5.20");
    private static final BigDecimal FOURTH_RATE = new BigDecimal("6.50");

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String unitsInput = request.getParameter("units");
        request.setAttribute("units", unitsInput);

        if (unitsInput == null || unitsInput.trim().isEmpty()) {
            showError(request, response, "Please enter the units consumed.");
            return;
        }

        try {
            BigDecimal units = new BigDecimal(unitsInput.trim());
            if (units.compareTo(BigDecimal.ZERO) < 0) {
                showError(request, response, "Units consumed cannot be negative.");
                return;
            }

            List<BillLine> billLines = calculateBill(units);
            BigDecimal total = billLines.stream()
                    .map(BillLine::getAmountValue)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            request.setAttribute("units", format(units));
            request.setAttribute("billLines", billLines);
            request.setAttribute("total", format(total));
            request.getRequestDispatcher("/result.jsp").forward(request, response);
        } catch (NumberFormatException exception) {
            showError(request, response, "Please enter a valid numeric value.");
        }
    }

    private void showError(HttpServletRequest request, HttpServletResponse response, String message)
            throws ServletException, IOException {
        request.setAttribute("error", message);
        request.getRequestDispatcher("/index.jsp").forward(request, response);
    }

    private List<BillLine> calculateBill(BigDecimal units) {
        List<BillLine> lines = new ArrayList<>();
        BigDecimal remaining = units;
        addLine(lines, "First 50 units", remaining.min(new BigDecimal("50")), FIRST_RATE);
        remaining = remaining.subtract(new BigDecimal("50")).max(BigDecimal.ZERO);
        addLine(lines, "Next 100 units", remaining.min(new BigDecimal("100")), SECOND_RATE);
        remaining = remaining.subtract(new BigDecimal("100")).max(BigDecimal.ZERO);
        addLine(lines, "Next 100 units", remaining.min(new BigDecimal("100")), THIRD_RATE);
        remaining = remaining.subtract(new BigDecimal("100")).max(BigDecimal.ZERO);
        addLine(lines, "Above 250 units", remaining, FOURTH_RATE);
        return lines;
    }

    private void addLine(List<BillLine> lines, String slab, BigDecimal units, BigDecimal rate) {
        if (units.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal amount = units.multiply(rate).setScale(2, RoundingMode.HALF_UP);
            lines.add(new BillLine(slab, format(units), format(rate), amount));
        }
    }

    private String format(BigDecimal value) {
        return value.setScale(2, RoundingMode.HALF_UP).stripTrailingZeros().toPlainString();
    }

    public static class BillLine {
        private final String slab;
        private final String units;
        private final String rate;
        private final BigDecimal amount;

        public BillLine(String slab, String units, String rate, BigDecimal amount) {
            this.slab = slab;
            this.units = units;
            this.rate = rate;
            this.amount = amount;
        }

        public String getSlab() { return slab; }
        public String getUnits() { return units; }
        public String getRate() { return rate; }
        public String getAmount() { return amount.toPlainString(); }
        public BigDecimal getAmountValue() { return amount; }
    }
}
