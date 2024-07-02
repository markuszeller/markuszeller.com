<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="/style.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=0.75, maximum-scale=0.75">
    <title>DJ N-4ceR aka Markus Zeller Music Profile</title>
    <link rel="preconnect" href="https://www.markuszeller.com">
    <meta name="description" content="Markus Zeller Homepage">
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
        <a target="_blank" id="spotify" title="Spotify" href="https://open.spotify.com/artist/2Tzmp2LceoFOr9n2hZ7C2L"></a>
        <a target="_blank" id="podcast" title="Podcast" href="https://markuszeller.com/podcast"></a>
        <a target="_blank" id="soundcloud" title="Soundcloud" href="https://soundcloud.com/dj-n-4cer"></a>
        <a target="_blank" id="youtube" title="Youtube" href="https://www.youtube.com/channel/UCPHO1UnGo21SSTFm00a5d-A"></a>
        <a target="_blank" id="tiktok" title="TikTok" href="https://www.tiktok.com/@markuszeller.com"></a>
        <a target="_blank" id="itunes" title="iTunes - Apple Music" href="https://music.apple.com/de/artist/markus-zeller/1384221074"></a>
        <a target="_blank" id="deezer" title="Deezer" href="https://www.deezer.com/de/artist/13317899"></a>
        <a target="_blank" id="tidal" title="Tidal" href="https://tidal.com/browse/artist/9176316"></a>
        <a target="_blank" id="amazon" title="Amazon Music" href="https://music.amazon.com/artists/B0797F355G/markus-zeller"></a>
    </section>
    <section>
        <a target="_blank" id="github" title="Github" href="https://github.com/markuszeller/"></a>
        <a target="_blank" id="instagram" title="Instagram" href="https://www.instagram.com/markuszeller/"></a>
        <a target="_blank" id="telegram" title="Telegram" href="https://telegram.me/markuszeller"></a>
        <a target="_blank" id="stackoverflow" title="Stack Overflow" href="https://stackoverflow.com/users/2645713/markus-zeller"></a>
        <a target="_blank" id="facebook" title="Facebook" href="https://www.facebook.com/markus.zeller.private/"></a>
        <a target="_blank" id="discord" title="Discord" href="https://discord.gg/mRcHXYfEWn"></a>
        <a target="_blank" id="pgp" title="Download PGP public key" href="/pgp-public.asc" rel="nofollow"></a>
    </section>
    <div id="scrolltext" style="display: none">
        Doep doe doe doep!
        Thank you for visiting my website markuszeller.com!
        Do you like it? Leave me some feedback.

        Listen to my music via the red buttons or contact me via the blue ones.
        Take a pill and choose wisely, stay in the matrix. Do not go over start and do not collect 4000 bucks.

        Want to always stay up to date about my latest music?
        Then consider subscribing to my podcast, Spotify, SoundCloud, Instagram or YouTube channel.
        My music will always be free to listen to, and if you like it, you can support me by smashing like buttons,
        leaving comments, and so on - the usual social media shit, or even go crazy and share it on the music portals.

        Yours, Markus Zeller aka DJ N-4ceR, Forces Grooves Records.
    </div>
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
