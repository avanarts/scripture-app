const display = document.querySelector("#verse-container");

//fetches data from the .json
async function bibleJSON() {
  let bibleData;
  const res = await fetch('./bible.json');
  bibleData = await res.json();
  return bibleData
}

//populates book dropdown
async function processBook() {
  const bookOptions = await bibleJSON();
  const select = document.getElementById("select-book")
  //i am very happy
  bookOptions.forEach(item => {
    let element = document.createElement("option");
    element.textContent = item.book;
    element.value = item.book;
    select.appendChild(element);
  });
}

//updates chapter dropdown based on choice in book dropdown
async function updateChapter() {
  const payload = await bibleJSON();
  const chapterDropdown = document.getElementById('select-chapter');
  const selectedBook = document.getElementById('select-book').value;

  const bookObj = payload.find(item => item.book === selectedBook);
  if (bookObj) {
    bookObj.chapters.forEach(chapterObj => {
      let option = document.createElement('option');
      option.textContent = chapterObj.chapter;
      option.value = chapterObj.chapter;
      chapterDropdown.appendChild(option);
    })

  }

}

//updates verse dropdown based on choice in chapter dropdown
async function updateVerse() {
  const payload = await bibleJSON();
  const verseDropdown = document.getElementById('select-verse');
  const selectedBook = document.getElementById('select-book').value;
  const selectedChapter = document.getElementById('select-chapter').value;
  const bookObj = payload.find(item => item.book === selectedBook);


  if (bookObj) {
    let chapterObj = bookObj.chapters.find(item => item.chapter === selectedChapter);
    if (chapterObj) {
        let versesCount = parseInt(chapterObj.verses, 10);
        for (let i = 1; i <= versesCount; i++) {
          let option = document.createElement('option');
          option.textContent = i;
          option.value = i;
          verseDropdown.appendChild(option)
        }
    }
  }

}

let returnedVerse;
//takes the choices from the dropdowns and uses them as parameters for an api call (triggered on button click)
function grabData() {
  
  //yay
  const submitBtn = document.getElementById('submit-btn');

  submitBtn.addEventListener('click', async () => {
    let selectedBookRaw = document.getElementById('select-book').value.toLowerCase();
    let selectedBook = selectedBookRaw.replace(/ /g, '');
    let selectedChapter = document.getElementById('select-chapter').value.toLowerCase();
    let selectedVerse = document.getElementById('select-verse').value.toLowerCase();

    fetch(
      `https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/en-asv/books/${selectedBook}/chapters/${selectedChapter}/verses/${selectedVerse}.json`
    )
      .then((response) => response.json())
      .then((data) => {
        returnedVerse = data
        display.textContent = data.text
      })
      .then(console.log('success'))
      .catch(err => console.log('error' + err))

  })
}



//takes an array and finds valid indices that randRemove() can then work with
function validArray() {
  let arr = document.getElementById('verse-container').textContent.split(' ');
  let validIndices = [];

  for (let [index, word] of arr.entries()) {
    if (word !== '---') {
      validIndices.push(index)
    }
  }
  return validIndices
};



function randRemove() {
  let randIntegers = [];
  let test = validArray()
  let verseText = document.getElementById('verse-container').textContent;
  let verseArray = verseText.split(' ');
  let modifiedVerse = document.getElementById('verse-container')


  for (let i = 0; i < 3; i++) {
    randIntegers.push(test[Math.floor(Math.random()* test.length)])
  }
  console.log(randIntegers)

  for (const [index, word] of verseArray.entries()) {
    if (word == '---') {
      continue
    } else if (randIntegers.includes(index)) {
      verseArray[index] = '---'
    } else if (test.length <= 3) {
      verseArray[index] = '---'
    }
  }
  console.log(verseArray)
  modifiedVerse.textContent = verseArray.join(" ");
}

function showVerse() {
  display.textContent = returnedVerse.text;
}


processBook();
grabData();