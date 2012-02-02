(function () {
    var defaultSettings = {
        silentUserFilterEnable: true
    };

    var siteInfo = {
        "www.instapaper.com": {
            "/": {
                selector: "a.tableViewCellTitleLink"
            }
        },
        "readitlaterlist.com": {
            "/": {
                selector: "a.item"
            }
        }
    };

    var site = siteInfo[window.location.host];
    if(!site){
        return;
    }

    var info;
    for(var path in site){
        if(window.location.pathname.indexOf(path) > -1){
            info = site[path];
            break;
        }
    }
    var linkElements = document.querySelectorAll(info.selector);
    if(linkElements && linkElements.length > 0){
        var urls = findUrls();
        loadFriendComments(urls, renderWidgets);
    }


    function findUrls() {
        var urls = [];
        for (var i = 0; i < linkElements.length; i++) {
            var link = linkElements[i];
            urls.push(link.href);
        }
        return urls;
    }

    function loadFriendComments(urls, callback) {
        var urlsToken = _joinUrls(urls);
        var endPoint = 'http://b.hatena.ne.jp/my.entry_favorites_counts?entries=' + urlsToken;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', endPoint, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                callback(JSON.parse(xhr.responseText));
            }
        };
        xhr.send();
    }

    function renderWidgets(context) {
        for (var i = 0; i < linkElements.length; i++) {
            var link = linkElements[i];
            var hb = context[link];
            if (!hb) {
                continue;
            }

            var widget = _createWidget(hb.favorites);
            link.parentNode.appendChild(widget);
        }
    }

    function _joinUrls(urls) {
        var urlsToken = urls[0];
        for (var i = 0; i < urls.length; i++){
            var url = urls[i];
            urlsToken += '|' + url;
        }
        return encodeURIComponent(urlsToken);
    }

    function _createWidget(bookmarks) {
        var ul = document.createElement('UL');
        for (var i = 0; i < bookmarks.length; i++) {
            var b = bookmarks[i];
            if (defaultSettings.silentUserFilterEnable && b.comment.length == 0) {
                continue;
            }

            var li = document.createElement('LI');
            var p = document.createElement('P');
            p.innerText = 'id:' + b.user + ' ' + b.comment;
            li.appendChild(p);
            ul.insertBefore(li);
        }
        var widget = document.createElement('DIV');
        widget.className = 'hBookmarkFavorites-widget';
        widget.appendChild(ul);
        return widget;
    }
})();
