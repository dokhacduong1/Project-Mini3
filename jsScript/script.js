var boxItem = document.getElementById("boxItem");
var pagita = document.getElementById("pagina");
var luuActive = 0;
var arayLi = [];
var checkGolbal =null;
var checEndGolbal =0;
function loadPage(page, page2 = null) {
    if (page2 != null) {
        if (page != null) {
            fetch(`http://localhost:3000/products?category=${page2}&&_page=${page}&_limit=9`)
                .then(reponse => reponse.json())
                .then((data => {
                    let htmlA = data.map((info) => {

                        return `<div class="boxItem-image1 col-4">
                        <img src="${info.images[0]}" alt="">
                        <h6>Tên Máy: ${info.title}</h2>
                        <p>Giá: ${info.price}</p>
                    </div>`
                    });

                    boxItem.innerHTML = htmlA.join("");
                }))
        } else {
            fetch(`http://localhost:3000/products?category=${page2}`)
                .then(reponse => reponse.json())
                .then((data => {
                    let htmlA = data.map((info) => {

                        return `<div class="boxItem-image1 col-4">
                        <img src="${info.images[0]}" alt="">
                        <h6>Tên Máy: ${info.title}</h2>
                        <p>Giá: ${info.price}</p>
                    </div>`
                    });

                    boxItem.innerHTML = htmlA.join("");
                }))
        }
    } else {
        fetch(`http://localhost:3000/products?_page=${page}&_limit=9`)
            .then((reponse) => {
                return reponse.json();
            })
            .then((data) => {

                let htmlA = data.map((info) => {

                    return `<div class="boxItem-image1 col-4">
                        <img src="${info.images[0]}" alt="">
                        <h6>Tên Máy: ${info.title}</h2>
                        <p>Giá: ${info.price}</p>
                    </div>`
                });

                boxItem.innerHTML = htmlA.join("");
            })
    }
}
loadPage(1);
async function checkLength(page2 = null) {
    let length = 0;
    let response = null
    if (page2 == null) {
        response = await fetch('http://localhost:3000/products');
    } else {
        response = await fetch(`http://localhost:3000/products?category=${page2}`);
    }
    let data = await response.json();
    length = data.length;
    return length;
}

checkLength().then((data) => {
    for (var i = 1; i <= (data / 9) + 1; i++) {
        i == 1 ?
            arayLi[i] = `<li class="active-pagina">${i}</li>` :
            arayLi[i] = ` <li>${i}</li>`

    }
    pagita.innerHTML = arayLi.join("");
    checEndGolbal = (data / 9) + 1;
    checkChangePagina(null,null);
});


function checkChangePagina(lenghtA=null,page2=null) {
    let selectBtnNext = document.getElementById("btn-next");
    let selectBtnPre = document.getElementById("btn-previous");
    let selectLi = document.querySelectorAll("#pagina li");
    
    for (let i = 0; i < selectLi.length; i++) {
        selectLi[i].addEventListener("click", () => {
            page2==null ? loadPage(i + 1) : loadPage(i+1,page2)
            selectLi[i].classList.add("active-pagina");
            selectLi[luuActive].classList.remove("active-pagina");
            luuActive = i;
            if (i == 0) { luuActive = 0 };
        });
    }
    
    selectBtnNext.addEventListener("click", () => {
        if (luuActive + 2 >= checEndGolbal) {
            return;
        }

        let selectLi = document.querySelectorAll("#pagina li");
        loadPage(luuActive + 2,checkGolbal);
        selectLi[luuActive + 1].classList.add("active-pagina");
        selectLi[luuActive].classList.remove("active-pagina");
        luuActive++;

    });
    selectBtnPre.addEventListener("click", () => {
        if (luuActive - 1 <= -1) {
            return;
        }
        let selectLi = document.querySelectorAll("#pagina li");
        loadPage(luuActive,checkGolbal);
        selectLi[luuActive - 1].classList.add("active-pagina");
        selectLi[luuActive].classList.remove("active-pagina");
        luuActive--;
    })
}
var navSelectOn = document.querySelector(".fa-square-caret-down");
var navSelectOf = document.querySelector(".fa-xmark");
var navBar = document.querySelector(".category-box");
function navCategory() {
    navSelectOn.addEventListener("click", () => {
        navSelectOn.style.display = "none";
        navSelectOf.style.display = "inline";
        navBar.style.display = "block";
    })
    navSelectOf.addEventListener("click", () => {
        navSelectOf.style.display = "none";
        navSelectOn.style.display = "inline";
        navBar.style.display = "none";
    })
}
navCategory();


async function loadPageCategory() {
    let slectT = document.getElementById("nav-cate");
    await fetch("http://localhost:3000/category")
        .then(reponse => reponse.json())
        .then((data) => {
            let htmlA = data.map((info) => {
                return `<li class="col-4">${info.charAt(0).toUpperCase() + info.slice(1)}</li>`;
            })
            slectT.innerHTML = htmlA.join("");
        });
    let slectU = document.querySelectorAll("#nav-cate li");
    return slectU;

}
loadPageCategory().then((data) => {
    for (let i = 0; i < data.length; i++) {
        data[i].addEventListener("click", () => {
            let arayLi2 = []
            pagita.innerHTML = "";
            let textA =data[i].textContent.charAt(0).toLowerCase() + data[i].textContent.slice(1);
            checkLength(textA).then((data) => {
                for (var i = 1; i <= (data / 9) + 1; i++) {
                    i == 1 ?
                        arayLi2[i] = `<li class="active-pagina">${i}</li>` :
                        arayLi2[i] = ` <li>${i}</li>`

                }
                pagita.innerHTML = arayLi2.join("");
                checEndGolbal=(data / 9) + 1;
                checkChangePagina(null,textA);
                
            });
            checkGolbal = data[i].textContent.charAt(0).toLowerCase() + data[i].textContent.slice(1);

            loadPage(1, data[i].textContent.charAt(0).toLowerCase() + data[i].textContent.slice(1));
            luuActive=0;
            navSelectOf.style.display = "none";
            navSelectOn.style.display = "inline";
            navBar.style.display = "none";
        })
    }
})








