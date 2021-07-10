
function filterMsgTestcase(url, msg_name) {
  theUrl = document.URL + url;
  params = "pk="+msg_name;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, true);
  xmlHttp.send(null);
  xmlHttp.onreadystatechange = (e) => {
    console.log(Http.responseText)
  }
}