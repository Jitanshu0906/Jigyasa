<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jigyasa Search Engine</title>
    <link rel="stylesheet" href="Assets/css/style.css">

    <!-- ✅ Add this line -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script defer src="Assets/java/script.js"></script>
</head>

<?php
$ip = $_SERVER['REMOTE_ADDR'];
$response = @file_get_contents("http://ip-api.com/json/$ip");
$data = json_decode($response, true);
if ($data && $data['status'] === 'success') {
    $user_ip       = $ip;
    $user_country  = $data['country'];
    $user_region   = $data['regionName'];
    $user_city     = $data['city'];
    $user_timezone = $data['timezone'];
    $user_isp      = $data['isp'];
} else {
    $user_ip       = $ip;
    $user_country  = "Unknown";
    $user_region   = "Unknown";
    $user_city     = "Unknown";
    $user_timezone = "Unknown";
    $user_isp      = "Unknown";
}
$api_key = "d329db35dd62c7493cce4ad3e7d39375";
$weather_url = "https://api.openweathermap.org/data/2.5/weather?q=" . urlencode($user_city) . "&appid=" . $api_key . "&units=metric";
$weather_json = @file_get_contents($weather_url);
$weather_data = json_decode($weather_json, true);

if ($weather_data && isset($weather_data['main'])) {
    $weather_temp      = round($weather_data['main']['temp']) . " °C";
    $weather_desc      = $weather_data['weather'][0]['description'];
    $weather_humidity  = $weather_data['main']['humidity'] . "%";
    $weather_feelslike = round($weather_data['main']['feels_like']) . " °C";
} else {
    $weather_temp      = "N/A";
    $weather_desc      = "Weather info unavailable";
    $weather_humidity  = "N/A";
    $weather_feelslike = "N/A";
}
?>

<body>
    <video autoplay muted loop playsinline class="background-video">
        <source src="Assets/images/88425-607855984.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
    <!-- Top Bar -->
    <div class="top-bar">
        <div class="location" id="location"><?php echo $user_city; ?></div>
        <div class="weather" id="weather"><?php echo $weather_temp; ?></div>
    </div>

    <!-- Search Box -->
    <div class="search-container" style="background-color: transparent; box-shadow: none; border-radius: 0;">
        <div class="logo" style="margin:0; padding:0;"><img src="Assets/images/Gemini_Generated_Image_budmw9budmw9budm-removebg-preview.png" alt="Jigyasa Logo" style="height:288px;"></div>
        <form class="search-bar" style="margin:0; padding:0;" action="https://www.google.com/search" method="get" onsubmit="return validateSearch();">
            <input type="text" name="q" id="searchInput" placeholder="Search Jigyasa...">
            <button type="submit">🔍</button>
            <button type="button" class="voice-search" onclick="startVoiceSearch()">🎤</button>
        </form>
    </div>

    <!-- Scrolling News Section -->
    <div class="news-section" style="background: none; box-shadow: none; border-radius: 0;">
        <div class="news-ticker-container" style="background: none; box-shadow: none;">
            <ul class="news-list" id="newsTicker">
                <!-- News items will be dynamically inserted here -->
                <li><a href="#"><div class="news-cube"><div class="news-cube-inner"><div class="news-cube-face front"></div><div class="news-cube-face back"></div><div class="news-cube-face right"></div><div class="news-cube-face left"></div><div class="news-cube-face top"></div><div class="news-cube-face bottom"></div></div></div> India signs major defense deal</a></li>
                <li><a href="#"><div class="news-cube"><div class="news-cube-inner"><div class="news-cube-face front"></div><div class="news-cube-face back"></div><div class="news-cube-face right"></div><div class="news-cube-face left"></div><div class="news-cube-face top"></div><div class="news-cube-face bottom"></div></div></div> SpaceX launches 50 satellites</a></li>
            </ul>
        </div>
    </div>
</body>
</html>
