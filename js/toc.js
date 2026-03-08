const toc = document.getElementById("toc");
const headers = document.querySelectorAll("h2");

let list = document.createElement("ul");

headers.forEach((header, index) => {

let id = "section-" + index;
header.id = id;

let item = document.createElement("li");

let link = document.createElement("a");
link.href = "#" + id;
link.textContent = header.textContent;

item.appendChild(link);
list.appendChild(item);

});

let title = document.createElement("b");
title.textContent = "Contents";

toc.appendChild(title);
toc.appendChild(list);  