<?php 
session_start();
// Redirect if not logged in
if (!isset($_SESSION['logged_in_user'])) {
    header("Location: login.php");
    exit();
}
$username = $_SESSION['logged_in_user'];
$phone = $_SESSION['logged_in_phone'] ?? 'Not Provided';
?>
<!DOCTYPE html>
<html>
<head>
    <title>Electricity Bill Calculator</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container mt-5">
        
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4>Welcome, <?php echo htmlspecialchars($username); ?></h4>
            <a href="logout.php" class="btn btn-danger">Log Out</a>
        </div>

        <div class="row justify-content-center">
            <div class="col-md-6">
                
                <?php
                // ==========================================
                // STEP 4: RECEIPT GENERATION
                // ==========================================
                if(isset($_POST['process_transaction'])) {
                    $units = $_POST['final_units'];
                    $bill = $_POST['final_bill'];
                    $method = $_POST['payment_method'];
                    $details = $_POST['payment_details'];
                    
                    // Generate Unique Transaction ID
                    $transaction_id = "TXN" . strtoupper(uniqid());
                    $blended_rate = ($units > 0) ? number_format($bill / $units, 2) : 0.00;
                    ?>

                    <div class="card shadow border-success">
                        <div class="card-header bg-success text-white text-center">
                            <h5>Payment Successful - Receipt</h5>
                        </div>
                        <div class="card-body">
                            <p class="text-center text-muted">Mock payment processed successfully.</p>
                            <hr>
                            <table class="table table-borderless">
                                <tbody>
                                    <tr>
                                        <th>Transaction ID:</th>
                                        <td><?php echo $transaction_id; ?></td>
                                    </tr>
                                    <tr>
                                        <th>Username:</th>
                                        <td><?php echo htmlspecialchars($username); ?></td>
                                    </tr>
                                    <tr>
                                        <th>Phone Number:</th>
                                        <td><?php echo htmlspecialchars($phone); ?></td>
                                    </tr>
                                    <tr>
                                        <th>Payment Method:</th>
                                        <td><?php echo htmlspecialchars($method); ?></td>
                                    </tr>
                                    <tr>
                                        <th>Payment Details:</th>
                                        <td><?php echo htmlspecialchars($details); ?></td>
                                    </tr>
                                    <tr>
                                        <th>Units Consumed:</th>
                                        <td><?php echo $units; ?> Units</td>
                                    </tr>
                                    <tr>
                                        <th>Average Rate/Unit:</th>
                                        <td>Rs. <?php echo $blended_rate; ?></td>
                                    </tr>
                                    <tr class="table-success">
                                        <th>Total Amount Paid:</th>
                                        <th>Rs. <?php echo number_format($bill, 2); ?></th>
                                    </tr>
                                </tbody>
                            </table>
                            <button class="btn btn-outline-secondary w-100 mt-2" onclick="window.print()">Print Receipt</button>
                            <a href="calculator.php" class="btn btn-primary w-100 mt-2">Calculate New Bill</a>
                        </div>
                    </div>

                <?php 
                // ==========================================
                // STEP 3: MOCK PAYMENT GATEWAY
                // ==========================================
                } elseif(isset($_POST['confirm_payment'])) { 
                    $units = $_POST['final_units'];
                    $bill = $_POST['final_bill'];
                ?>
                    <div class="card shadow border-info mb-4">
                        <div class="card-header bg-info text-white text-center">
                            <h5>Payment Gateway</h5>
                        </div>
                        <div class="card-body">
                            <h4 class="text-center mb-4">Amount Due: Rs. <?php echo number_format($bill, 2); ?></h4>
                            
                            <form method="POST">
                                <input type="hidden" name="final_units" value="<?php echo $units; ?>">
                                <input type="hidden" name="final_bill" value="<?php echo $bill; ?>">
                                
                                <label class="form-label">Select Payment Method</label>
                                <select name="payment_method" class="form-select mb-3" required>
                                    <option value="" disabled selected>Choose a method...</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Netbanking">Netbanking</option>
                                    <option value="Credit/Debit Card">Credit/Debit Card</option>
                                </select>

                                <label class="form-label">Payment Details (UPI ID / Bank Name / Card Number)</label>
                                <input type="text" name="payment_details" class="form-control mb-4" placeholder="Enter details..." required>
                                
                                <button type="submit" name="process_transaction" class="btn btn-success w-100 btn-lg">Complete Payment</button>
                                <a href="calculator.php" class="btn btn-outline-danger w-100 mt-2">Cancel</a>
                            </form>
                        </div>
                    </div>

                <?php 
                // ==========================================
                // STEP 2: BILL REVIEW
                // ==========================================
                } elseif(isset($_POST['calculate'])) { 
                    $units = $_POST['units'];
                    $bill = 0;
                    
                    // Calculation Logic based on tariff
                    if($units <= 50) {
                        $bill = $units * 3.5;
                    } elseif($units <= 150) {
                        $bill = (50 * 3.5) + (($units - 50) * 4);
                    } elseif ($units <= 250) {
                        $bill = (50 * 3.5) + (100 * 4) + (($units - 150) * 5.2);
                    } else {
                        $bill = (50 * 3.5) + (100 * 4) + (100 * 5.2) + (($units - 250) * 6.5);
                    }
                ?>
                    <div class="card shadow border-warning mb-4">
                        <div class="card-header bg-warning text-dark text-center">
                            <h5>Bill Summary</h5>
                        </div>
                        <div class="card-body text-center">
                            <p class="lead">Your calculated bill for <strong><?php echo $units; ?> units</strong> is:</p>
                            <h2 class="text-danger mb-4">Rs. <?php echo number_format($bill, 2); ?></h2>
                            
                            <form method="POST">
                                <input type="hidden" name="final_units" value="<?php echo $units; ?>">
                                <input type="hidden" name="final_bill" value="<?php echo $bill; ?>">
                                <button type="submit" name="confirm_payment" class="btn btn-success w-100 btn-lg">Proceed to Checkout</button>
                                <a href="calculator.php" class="btn btn-outline-secondary w-100 mt-2">Back</a>
                            </form>
                        </div>
                    </div>

                <?php 
                // ==========================================
                // STEP 1: INITIAL CALCULATOR FORM
                // ==========================================
                } else { 
                ?>
                    <div class="card shadow mb-4">
                        <div class="card-header bg-primary text-white text-center">
                            <h3>Electricity Bill Calculator</h3>
                        </div>
                        <div class="card-body">
                            <form method="POST">
                                <label class="form-label">Enter Electricity Units</label>
                                <input type="number" name="units" class="form-control" min="0" required>
                                <br>
                                <button type="submit" name="calculate" class="btn btn-primary w-100">Calculate Bill</button>
                            </form>
                        </div>
                    </div>
                <?php } ?>

            </div>
        </div>
    </div>
</body>
</html>