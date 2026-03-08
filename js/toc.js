document.addEventListener("DOMContentLoaded", function () {

const tocList = document.getElementById("toc-list");
const headings = document.querySelectorAll(".mw-content h2");

let sectionNumber = 1;

headings.forEach(function(heading){

const id = heading.textContent.toLowerCase().replace(/\s+/g, "-");

heading.id = id;

const li = document.createElement("li");

const link = document.createElement("a");
link.href = "#" + id;
link.textContent = sectionNumber + " " + heading.textContent;

li.appendChild(link);
tocList.appendChild(li);

sectionNumber++;

});

});