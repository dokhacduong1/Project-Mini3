var boxItem = document.getElementById("boxItem");

var insertPagination = document.getElementById("pagina");

//checkLiPagination mỗi khi thay đổi;
var listLi = document.querySelectorAll("#pagina li");

var saveActivePagination = 0;

var saveTextPagination = "";

var indexPagination = 1;

async function showHome() {
    let pagination = await showDataPagination();
    pagination.homePagination();
}

//Lấy các sự kiện như đổi trang,qua danh mục mới
function pagePagination() {

    let homePage = (indexTab) => {
        return `_page=${indexTab}&_limit=9`;
    }

    let navPage = (textCategory, indexTab) => {
        return `category=${textCategory}&&_page=${indexTab}&_limit=9`;
    }

    let searchPage = (title, indexTab) => {
        return `title=${title}&&_page=${indexTab}&_limit=9`;
    }

    return {
        homePage: homePage,
        navPage: navPage,
        searchPage: searchPage
    }

}


//Start LoadData API
function loadDataServer(dataLink = "") {

    //Hàm này lấy data toàn cục của web
    fetch(`http://localhost:3000/products?${dataLink}`)
        .then(reponse => reponse.json())
        .then((data) => {
            let htmlA = data.map((info) => {

                return `<div class="boxItem-image1 col-4">
                            <img src="${info.images[0]}" alt="">
                            <h6>Tên Sản Phẩm: ${info.title}</h2>
                            <p>Giá: ${info.price}</p>
                        </div>`
            });
            boxItem.innerHTML = htmlA.join("");
        });

};

async function loadDataCategory(dataLink = "") {

    //Hàm này lấy cái dữ liệu danh mục và trả về
    let inputCategoryInNav = document.getElementById("nav-cate");

    await fetch("http://localhost:3000/category")
        .then(reponse => reponse.json())
        .then((data) => {
            let htmlA = data.map((info) => {
                //đoạn này Viết hoa chữ cái đầu cho đẹp
                return `<li class="col-4">${info.charAt(0).toUpperCase() + info.slice(1)}</li>`;
            })
            inputCategoryInNav.innerHTML = htmlA.join("");
        });

    let fullTagLiNew = document.querySelectorAll("#nav-cate li");

    checkClickCategoryBtn(fullTagLiNew);

}
//End LoadData API



//Start Category
function showAndHideCategory() {

    //Hàm này có tác dụng nó show xuống cái danh mục
    let navSelectOn = document.querySelector(".fa-square-caret-down");

    let navSelectOf = document.querySelector(".fa-xmark");

    let navBar = document.querySelector(".category-box");

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

function checkClickCategoryBtn(tagLiCategory) {

    let navSelectOn = document.querySelector(".fa-square-caret-down");

    let navSelectOf = document.querySelector(".fa-xmark");

    let navBar = document.querySelector(".category-box");

    for (let i = 0; i < tagLiCategory.length; i++) {
        tagLiCategory[i].addEventListener("click", async () => {
            navSelectOf.style.display = "none";
            navSelectOn.style.display = "inline";
            navBar.style.display = "none";
            //Convert sang chữ thường
            saveActivePagination = 0;
            let convertTextToLowwer = tagLiCategory[i].textContent.charAt(0).toLowerCase() + tagLiCategory[i].textContent.slice(1);
            let dataConvert = pagePagination().navPage(convertTextToLowwer, 1);
            //Load data của web khi chuyển qua danh mục mới
            loadDataServer(dataConvert);
            //Lấy data Pagination của danh mục mới mỗi khi chuyển qua lại và in ra 
            (await showDataPagination(dataConvert, convertTextToLowwer)).navPagi();
            ///Khi xong cập nhật lại cái listLi để hỗ trợ sự kiện click Pagination
            listLi = document.querySelectorAll("#pagina li");
        });
    }

}


//End Category



//Start Pagination

async function checkSoLuongSanPham(dataLink = "") {

    let length = 0;

    let response = null

    response = await fetch(`http://localhost:3000/products?${dataLink}`);

    let data = await response.json();

    length = await data.length;

    return length;
}

async function showDataPagination(dataPagination = "", textData = "") {

    let length = await checkSoLuongSanPham(dataPagination).then(data => { return data });

    let arayLi = [];

    for (var i = 1; i <= (length / 9) + 1; i++) {
        i == 1 ?
            arayLi[i] = `<li class="active-pagina">${i}</li>` :
            arayLi[i] = ` <li>${i}</li>`
    }

    insertPagination.innerHTML = arayLi.join("");

    listLi = document.querySelectorAll("#pagina li");

    //Đoạn này chia ra từng mục để load dữ liệ pagati
    let homePagination = async () => {
        await checkClickPaginationNumber().homePageNumberPagination();
        await checkClickPaginationBtn().onClickNext(1);
        await checkClickPaginationBtn().onClickPres(1);
    }

    let navPagi = async () => {
        await checkClickPaginationNumber().navPageNumberPagination(textData);
        await checkClickPaginationBtn(textData).onClickNext(2);
        await checkClickPaginationBtn(textData).onClickPres(2);
    }
    let searchPagi = async () => {
        await checkClickPaginationNumber().searchPageNumberPagination(textData);
        await checkClickPaginationBtn(textData).onClickNext(3);
        await checkClickPaginationBtn(textData).onClickPres(3);
    }

    return {
        homePagination: homePagination,
        navPagi: navPagi,
        searchPagi: searchPagi
    }

}

function checkClickPaginationNumber() {

    //Trong đây nó cũng lấy cá Li nè
    let homePageNumberPagination = () => {
        for (let i = 0; i < listLi.length; i++) {
            listLi[i].addEventListener("click", () => {
                loadDataServer(pagePagination().homePage(i + 1));
                listLi[i].classList.add("active-pagina");
                listLi[saveActivePagination].classList.remove("active-pagina");
                saveActivePagination = i;
            });
        }
    }

    let navPageNumberPagination = (textCategory) => {
        for (let i = 0; i < listLi.length; i++) {
            listLi[i].addEventListener("click", () => {
                loadDataServer(pagePagination().navPage(textCategory, i + 1));
                listLi[i].classList.add("active-pagina");
                listLi[saveActivePagination].classList.remove("active-pagina");
                saveActivePagination = i;
            });
        }
    }

    let searchPageNumberPagination = (textCategory) => {
        for (let i = 0; i < listLi.length; i++) {
            listLi[i].addEventListener("click", () => {
                loadDataServer(pagePagination().searchPage(textCategory, i + 1));
                listLi[i].classList.add("active-pagina");
                listLi[saveActivePagination].classList.remove("active-pagina");
                saveActivePagination = i;
            });
        }
    }

    return {
        homePageNumberPagination: homePageNumberPagination,
        navPageNumberPagination: navPageNumberPagination,
        searchPageNumberPagination: searchPageNumberPagination
    }
}

function checkClickPaginationBtn(textCategory = "") {

    // Hàm này dựa vào hàm showDataPagination để lấy thuộc tính từng sự kiện Pagination để click nút Next và Press
    saveTextPagination = textCategory;
    let pageFunctions = {
        1: pagePagination().homePage,
        2: pagePagination().navPage,
        3: pagePagination().searchPage
    };

    let selectBtnNext = document.getElementById("btn-next");

    let selectBtnPre = document.getElementById("btn-previous");

    let onClickNext = (index) => {
        indexPagination = index;
        selectBtnNext.addEventListener("click", () => {
            if (saveActivePagination + 1 >= listLi.length) {
                return;
            }
            //Đoạn này nếu bằng 1 thì nó sẽ trả về luôn  saveActivePagination + 2 để dùng dc ở home
            loadDataServer(pageFunctions[indexPagination](indexPagination == 1 ? saveActivePagination + 2 : saveTextPagination, saveActivePagination + 2));
            listLi[saveActivePagination + 1].classList.add("active-pagina");
            listLi[saveActivePagination].classList.remove("active-pagina");
            saveActivePagination++;
        })
    };

    let onClickPres = (index) => {
        indexPagination = index;
        selectBtnPre.addEventListener("click", () => {
            if (saveActivePagination - 1 < 0) {
                return;
            }
            if (indexPagination == 1) {
                loadDataServer(pagePagination().homePage(saveActivePagination))
            } else if (indexPagination == 2) {
                loadDataServer(pagePagination().navPage(saveTextPagination, saveActivePagination));
            } else if (indexPagination == 3) {
                loadDataServer(pagePagination().searchPage(saveTextPagination, saveActivePagination));
            }
            listLi[saveActivePagination - 1].classList.add("active-pagina");
            listLi[saveActivePagination].classList.remove("active-pagina");
            saveActivePagination--;
        })
    };

    return {
        onClickNext: onClickNext,
        onClickPres: onClickPres
    }
}
//End Pagination

//Start Search
function checkInputSearch() {

    let input = document.getElementById("input-search");

    let button = document.getElementById("search-button");

    button.addEventListener("click", async () => {
        let inputValue = input.value;
        let dataConvert = pagePagination().searchPage(inputValue, 1);
        saveActivePagination = 0;
        loadDataServer(dataConvert);
        (await showDataPagination(dataConvert, inputValue)).searchPagi();
    });
    
}
//End Search




// Thêm sự kiện click cho button

loadDataServer(pagePagination().homePage(1));
showHome();
showAndHideCategory();
loadDataCategory();
checkInputSearch();


