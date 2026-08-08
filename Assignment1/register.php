<?php 
session_start();
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $phone = $_POST['phone'];
    $password = $_POST['password'];
    
    // Store user data in a nested session array to mock a database
    $_SESSION['users'][$username] = [
        'password' => $password,
        'phone' => $phone
    ];
    $success = "Registration successful! You can now <a href='login.php'>Login</a>.";
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Register</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-5">
                <div class="card shadow">
                    <div class="card-header bg-dark text-white text-center">
                        <h3>Register</h3>
                    </div>
                    <div class="card-body">
                        <?php if(isset($success)) echo "<div class='alert alert-success'>$success</div>"; ?>
                        <form method="POST">
                            <label class="form-label">Username</label>
                            <input type="text" name="username" class="form-control" required>
                            
                            <label class="form-label mt-2">Phone Number</label>
                            <input type="tel" name="phone" class="form-control" pattern="[0-9]{10}" title="Enter a valid 10-digit phone number" required>

                            <label class="form-label mt-2">Password</label>
                            <input type="password" name="password" class="form-control" required>
                            
                            <button type="submit" class="btn btn-primary w-100 mt-4">Register</button>
                        </form>
                        <p class="mt-3 text-center"><a href="index.php">Back to Home</a></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>