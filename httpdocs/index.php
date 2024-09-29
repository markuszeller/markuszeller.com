<?php
$title = 'DJ N-4ceR aka Markus Zeller Music Profile';
$audioProfiles = [
    'spotify' => 'https://open.spotify.com/artist/2Tzmp2LceoFOr9n2hZ7C2L',
    'podcast' => 'https://markuszeller.com/podcast',
    'soundcloud' => 'https://soundcloud.com/dj-n-4cer',
    'youtube' => 'https://www.youtube.com/channel/UCPHO1UnGo21SSTFm00a5d-A',
    'tiktok' => 'https://www.tiktok.com/@markuszeller.com',
    'itunes' => 'https://music.apple.com/de/artist/markus-zeller/1384221074',
    'deezer' => 'https://www.deezer.com/de/artist/13317899',
    'tidal' => 'https://tidal.com/browse/artist/9176316',
    'amazon' => 'https://music.amazon.com/artists/B0797F355G/markus-zeller',
];
$socialProfiles = [
    'github' => 'https://github.com/markuszeller/',
    'instagram' => 'https://www.instagram.com/markuszeller/',
    'telegram' => 'https://telegram.me/markuszeller',
    'stackoverflow' => 'https://stackoverflow.com/users/2645713/markus-zeller',
    'facebook' => 'https://www.facebook.com/markus.zeller.private/',
    'discord' => 'https://discord.gg/mRcHXYfEWn',
    'pgp' => 'https://markuszeller.com/pgp-public.asc',
];
$colors = (object)[
    'reset' => "\033[0m",
    'bold' => "\033[1m",
    'blue' => "\033[34m",
    'magenta' => "\033[35m",
    'cyan' => "\033[36m",
];
if (str_starts_with(strtolower($_SERVER['HTTP_USER_AGENT'] ?? ''), 'curl')) {
    header('Content-Type: text/plain');
    readfile('./avatar.asc');
    echo PHP_EOL, $colors->bold, $colors->cyan, $title, $colors->reset, PHP_EOL, PHP_EOL;
    $format = "%s%13s: $colors->reset%s\n";
    foreach ($audioProfiles as $id => $url) {
        printf($format, $colors->blue, ucfirst($id), $url);
    }
    echo PHP_EOL;
    foreach ($socialProfiles as $id => $url) {
        printf($format, $colors->magenta, ucfirst($id), $url);
    }
    echo PHP_EOL;
    exit;
}
?><!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="/style.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=0.75, maximum-scale=0.75">
    <title><?=$title; ?></title>
    <link rel="preconnect" href="https://www.markuszeller.com">
    <meta name="description" content="Markus Zeller Homepage">
    <link rel="canonical" href="https://www.markuszeller.com">
    <link rel="alternate" type="application/rss+xml" title="DJ N-4ceR Promo Podcast by Markus Zeller" href="https://www.markuszeller.com/podcast/itunes.rss">
    <meta property="og:title" content="Markus Zeller">
    <meta property="og:url" content="https://www.markuszeller.com">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="en_US">
    <meta property="og:site_name" content="Markus Zeller">
    <meta property="fb:app_id" content="119351002115701">
    <meta property="og:description" content="Hello and welcome to my homepage. I am Markus Zeller who likes to code, make music, make some graphics stuff and bodybuilding.
Here you'll find some of my public projects and official social pages like Facebook, Instagram or my Youtube channel.">
    <meta property="og:image" content="https://www.markuszeller.com/img/markuszeller.png">
    <meta property="og:image:secure_url" content="https://www.markuszeller.com/img/markuszeller.png">
    <meta property="og:image:type" content="image/png">
    <meta property="og:image:width" content="600">
    <meta property="og:image:height" content="600">
    <meta property="og:image:alt" content="A photo from Markus Zeller in a pixeled Southpark character style.">
    <script src="/main.js" defer type="module"></script>
</head>
<body>

<main>
    <canvas id="canvas" width="512" height="624"></canvas>
    <section>
        <?php
        $format = '<a target="_blank" id="%s" title="%s" href="%s"></a>' . PHP_EOL;
        foreach ($audioProfiles as $id => $url) {
            printf($format, $id, ucfirst($id), $url);
        }
        ?>
    </section>
    <section>
        <?php
        foreach ($socialProfiles as $id => $url) {
            printf($format, $id, ucfirst($id), $url);
        }
        ?>
    </section>
    <ul id="scrolltext" style="display: none">
        <li>Oh yet another weekend demoscene party. The deadline in Berlin from October 6th. And guess what?!
            I made a remote entry. Be prepared for a full on acid track.</li>

        <li>Listen to my music via the red buttons or contact me via the blue ones.
            Take a pill and choose wisely, stay in the matrix. Do not go over start and do not collect 4000 bucks.</li>

        <li>Want to always stay up to date about my latest music?
        Then consider subscribing to my podcast, Spotify, SoundCloud, Instagram or YouTube channel.
        My music will always be free to listen to, and if you like it, you can support me by smashing like buttons,
            leaving comments, and so on - the usual social media shit, or even go crazy and share it on the music portals.</li>

        <li>Yours, Markus Zeller aka DJ N-4ceR, Forced Grooves Records.</li>
    </ul>
</main>

<footer style="display: none">
    <dl>
        <dd>Hello and Welcome to my Artist page!</dd>
        <dd>I am Markus Zeller aka DJ N-4ceR.</dd>
    </dl>
    <dl>
        <dd>Here you will find my latest songs and</dd>
        <dd>all the links to the music portals.</dd>
    </dl>
    <dl>
        <dd>Just hover over the ones of your interest</dd>
        <dd>and click it to open in a new tab.</dd>
    </dl>
    <dl>
        <dd>Here comes a tracklist of my releases</dd>
        <dd>ordered by release date, latest first.</dd>
    </dl>
    <section id="tracklist">
        <?php readfile(__DIR__ . '/tracklist.html'); ?>
    </section>
</footer>
</body>
</html>
