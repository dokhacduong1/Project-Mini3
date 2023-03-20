var boxItem = document.getElementById("boxItem");

var insertPagination = document.getElementById("pagina");

//checkLiPagination mỗi khi thay đổi;
var listLi = document.querySelectorAll("#pagina li");

var saveActivePagination = 0;

var saveTab = 1;

var saveTextCategory = "";

var saveTextPagination = "";

var saveTextSearch = "";

var indexPagination = 1;

var saveSort = 1;

async function showHome() {
    let pagination = await showDataPagination();
    pagination.homePagination();
}

//Lấy các sự kiện như đổi trang,qua danh mục mới
function pagePagination() {

    let homePage = (indexTab) => {
        if (saveSort == 1) {
            return `_page=${indexTab}&_limit=9`;
        } else if (saveSort == 2) {
            return `_page=${indexTab}&_limit=9&_sort=price&_order=asc`;
        } else if (saveSort == 3) {
            return `_page=${indexTab}&_limit=9&_sort=price&_order=desc`;
        }
    }

    let navPage = (textCategory, indexTab) => {
        if (saveSort == 1) {
            return `category=${textCategory}&&_page=${indexTab}&_limit=9`;
        } else if (saveSort == 2) {
            console.log("2")
            return `category=${textCategory}&&_page=${indexTab}&_limit=9&_sort=price&_order=asc`;
        } else if (saveSort == 3) {
            console.log("3")
            return `category=${textCategory}&&_page=${indexTab}&_limit=9&_sort=price&_order=desc`;
        }
    }

    let searchPage = (title, indexTab) => {
        if (saveSort == 1) {
            return `title=${title}&&_page=${indexTab}&_limit=9`;
        } else if (saveSort == 2) {
            return `title=${title}&&_page=${indexTab}&_limit=9&_sort=price&_order=asc`;
        }
        else if (saveSort == 3) {
            return `title=${title}&&_page=${indexTab}&_limit=9&_sort=price&_order=desc`;
        }
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
    fetch(`https://json-server-duong.vercel.app/products?${dataLink}`)
        .then(reponse => reponse.json())
        .then((data) => {
            if(data.length == 0){
                let boxItem= document.getElementById("boxItem");
                boxItem.innerHTML = `<div class="text-center col-12">
                                        <p><strong>Không Có Sản Phẩm Nào Được Hiển Thị</strong></p>
                                    </div>`
                                    return;
            }
            let htmlA = data.map((info) => {

                return `<div class="boxItem-image1 col-xl-4 col-lg-4 col-md-4 col-sm-6">
                            <img src="${info.images[0]}" alt="">
                            <h6>Tên Sản Phẩm: ${info.title}</h2>
                            <p>Giá: <strong>${info.price} <i class="fa-solid fa-coins"></i></strong></p>
                        </div>`
            });
            boxItem.innerHTML = htmlA.join("");
        });

};

async function loadDataCategory(dataLink = "") {

    //Hàm này lấy cái dữ liệu danh mục và trả về
    let inputCategoryInNav = document.getElementById("nav-cate");

    await fetch("https://json-server-duong.vercel.app/category")
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

            saveTextCategory = convertTextToLowwer;

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

    response = await fetch(`https://json-server-duong.vercel.app/products?${dataLink}`);

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
        saveTab = 1;
        await checkClickPaginationNumber().homePageNumberPagination();
        await checkClickPaginationBtn().onClickNext(1);
        await checkClickPaginationBtn().onClickPres(1);
    }

    let navPagi = async () => {
        saveTab = 2;
        await checkClickPaginationNumber().navPageNumberPagination(textData);
        await checkClickPaginationBtn(textData).onClickNext(2);
        await checkClickPaginationBtn(textData).onClickPres(2);
    }
    let searchPagi = async () => {
        saveTab = 3;
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
        
        if(inputValue.length == 0){
            let boxItem= document.getElementById("boxItem");
            boxItem.innerHTML = `<div class="text-center col-12">
            <p><strong>Vui Lòng Nhập Sản Phẩm</strong></p>
        </div>`
        return;
        }
        saveTextSearch = inputValue;
        let dataConvert = pagePagination().searchPage(inputValue, 1);
        saveActivePagination = 0;
        loadDataServer(dataConvert);
        (await showDataPagination(dataConvert, inputValue)).searchPagi();
    });

}
//End Search


//CheckSort
function checkSort() {
    let sortAsc = document.getElementById("sort-asc");
    let sortDesc = document.getElementById("sort-desc");
    let sortNormal = document.getElementById("sort-normal");
    sortNormal.addEventListener("click", async () => {
        saveSort = 1
        if (saveTab == 1) {
            loadDataServer(pagePagination().homePage(saveActivePagination + 1));
        } else if (saveTab == 2) {
            let dataConvert = pagePagination().navPage(saveTextCategory, saveActivePagination + 1);
            loadDataServer(dataConvert);
        }
        else if (saveTab == 3) {
            let dataConvert = pagePagination().searchPage(saveTextSearch, 1);
            loadDataServer(dataConvert);
        }

    });
    sortAsc.addEventListener("click", async () => {
        saveSort = 2;
        if (saveTab == 1) {
            loadDataServer(pagePagination().homePage(saveActivePagination + 1));
        } else if (saveTab == 2) {
            let dataConvert = pagePagination().navPage(saveTextCategory, saveActivePagination + 1);
            loadDataServer(dataConvert);
        } else if (saveTab == 3) {
            console.log("1")
            let dataConvert = pagePagination().searchPage(saveTextSearch, 1);
            loadDataServer(dataConvert);
        }

    });
    sortDesc.addEventListener("click", async () => {
        saveSort = 3;
        if (saveTab == 1) {
            loadDataServer(pagePagination().homePage(saveActivePagination + 1));
        } else if (saveTab == 2) {
            let dataConvert = pagePagination().navPage(saveTextCategory, saveActivePagination + 1);
            loadDataServer(dataConvert);
        } else if (saveTab == 3) {
            console.log("2")
            let dataConvert = pagePagination().searchPage(saveTextSearch, 1);
            loadDataServer(dataConvert);
        }

    });
}
//EndSort



// Thêm sự kiện click cho button

loadDataServer(pagePagination().homePage(1));
showHome();
showAndHideCategory();
loadDataCategory();
checkInputSearch();
checkSort();

