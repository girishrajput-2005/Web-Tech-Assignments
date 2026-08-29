# Electricity Bill Calculator

A beginner-friendly Maven Java Servlet and JSP application for calculating electricity bills using slab-wise rates.

## Technologies

- Java Servlet 4.0
- JSP
- Maven
- Apache Tomcat 9+
- Bootstrap 5 and custom CSS

## Billing slabs

| Units consumed | Rate |
| --- | ---: |
| First 50 | Rs. 3.50/unit |
| Next 100 | Rs. 4.00/unit |
| Next 100 | Rs. 5.20/unit |
| Above 250 | Rs. 6.50/unit |

## Run with Tomcat

1. Build the WAR file:

   ```bash
   mvn clean package
   ```

2. Copy `target/electricity-bill-calculator.war` into Tomcat's `webapps` folder.
3. Start Apache Tomcat.
4. Open `http://localhost:8080/electricity-bill-calculator/`.

The servlet performs validation and all bill calculations on the server. The JSP pages only display the input form and result.
