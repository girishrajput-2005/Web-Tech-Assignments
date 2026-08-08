<?php session_start(); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Electricity Bill System - Home</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8 text-center">
                <div class="card shadow">
                    <div class="card-header bg-primary text-white">
                        <h2>Welcome to the Electricity Billing Portal</h2>
                    </div>
                    <div class="card-body p-5">
                        <p class="lead">Manage your electricity consumption and generate bills seamlessly. Our smart calculator automatically applies the latest tariff tiers to give you an accurate and transparent breakdown of your monthly usage.</p>
                        <div class="mt-4">
                            <?php if(isset($_SESSION['logged_in_user'])): ?>
                                <a href="calculator.php" class="btn btn-success me-2">Go to Calculator</a>
                                <a href="logout.php" class="btn btn-danger">Log Out</a>
                            <?php else: ?>
                                <a href="login.php" class="btn btn-primary me-2">Login</a>
                                <a href="register.php" class="btn btn-outline-primary">Register</a>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>