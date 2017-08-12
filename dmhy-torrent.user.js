// ==UserScript==
// @author      Inndy Lin
// @description Easy download torrent from share.dmhy.org
// @name        dmhy-torrent
// @namespace   DMHY
// @include     http://share.dmhy.org/*
// @include     https://share.dmhy.org/*
// @downloadURL https://github.com/Inndy/dmhy-torrent/raw/master/dmhy-torrent.user.js
// @run-at      document-end
// @version     1.0
// @grant       none
// ==/UserScript==

var CHT2CHS = {
  '種子': '种子'
};

var LANG_TYPE = navigator.language.match(/zh-CN|zh-SG/) ? 'zh-CN' : 'zh-TW';

function _s(txt)
{
  return LANG_TYPE == 'zh-TW' ? txt : (CHT2CHS[txt] || txt);
}

function getTorrentUrl (src)
{
  return new Promise(function (resolve, reject) {
    jQuery.ajax({
      url: src,
      dataType: 'html',
      success: function (response) {
        var parsed = jQuery(response);
        var node = parsed.find('#resource-tabs > div > p > a:first');
        var url = node.attr('href');
        if (url && url.length) {
          resolve(url);
        } else {
          reject();
        }
      }
    });
  });
}

function install ()
{
  $('#topic_list > thead > tr > th:nth-child(4) > span').text(_s('種子'));
  $('#topic_list > tbody > tr > td > a.download-arrow').click(function () {
    var node = $(this).parents('tr').find('td.title > a');
    var link = node.attr('href');
    getTorrentUrl(link).then(
      src => { location.href = src; },
      () => $(this).parent().text('X').css('color', 'red')
    );
    return false;
  });
}

if (jQuery && jQuery('#topic_list').length == 1) {
  install();
}
