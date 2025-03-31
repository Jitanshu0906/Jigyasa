<?php
header('Content-Type: application/json');

// Define RSS feed sources
$rssFeeds = [
    'Neowin' => 'https://www.neowin.net/news/rss/',
    'TechCrunch' => 'https://techcrunch.com/feed/',
    'Engadget' => 'https://www.engadget.com/rss.xml',
    'The Hindu' => 'https://www.thehindu.com/news/national/feeder/default.rss'
];

// Array to store combined news
$newsList = [];

foreach ($rssFeeds as $source => $url) {
    $rss = @simplexml_load_file($url);

    if ($rss !== false && isset($rss->channel->item[2])) {
        $item = $rss->channel->item[2];
        $title = (string)$item->title;
        $link = (string)$item->link;

        $newsList[] = [
            'source' => $source,
            'title' => $title,
            'link' => $link,
            'formatted' => "📰 [$source] $title — Read more: $link"
        ];
    } else {
        $newsList[] = [
            'source' => $source,
            'title' => '❌ Failed to load feed.',
            'link' => '',
            'formatted' => "❌ [$source] Unable to fetch news."
        ];
    }
}

// Save to JSON file
file_put_contents(__DIR__ . '/news.json', json_encode($newsList, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// Output the same JSON
echo json_encode($newsList, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>
