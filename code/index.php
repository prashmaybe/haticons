<?php
$json_data = file_get_contents('data/icons.json');
$haticons = json_decode($json_data, true);
include 'includes/header.php';
?>

    <a class="logo hi-haticons" href="/"></a>
    <h1 class="welcome">Welcome !</h1>
    <div class="front-text">
        <h2>Haticons is a set of beautifully crafted Free Premium Font Icons</h2>
        <h3>Best fit to use in Web, iOS, Android, and Desktop apps.</h3>
        <a href="/download/haticons.zip" class="download">Download Haticons</a>
        <button class="cheatsheet">Cheatsheet</button>
        <h2 class="tac">CDN</h2>
        <div class="cdn">https://cdn.haticons.com/css/haticons.css</div>
        <p class="version">Version - 1.0.8</p>
    </div>
    <div class="modal cheatsheet-modal">
        <button class="close"></button>
        <input type="text" name="search-haticon" placeholder="Search Haticons here...">
        <div class="haticons-set">
            <?php
            $seen = array();
            foreach ($haticons as $icon):
                if (in_array($icon['class'], $seen)) { continue; }
                $seen[] = $icon['class'];
            ?>
                <div class="haticons-box" tags="<?php echo strtolower($icon['class']); ?>">
                    <i class="<?php echo $icon['class']; ?>"></i>
                    <p class="haticons-data">
                        class = <span class="select-all"><?php echo $icon['class']; ?></span><br />
                        css-content = <span class="select-all">"<?php echo $icon['content']; ?>"</span>
                    </p>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

<?php include 'includes/footer.php'; ?>
