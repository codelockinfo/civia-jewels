(function ($) {
    var $body = $('body'),
        $doc = $(document),
        $html = $('html'),
        $win = $(window),
        sliderNavHTML;

    $doc.ready(() => {
        $doc.ajaxStart(() => {
            halo.isAjaxLoading = true;
        });

        $doc.ajaxStop(() => {
            halo.isAjaxLoading = false;
        });

        halo.ready();
    });

    document.addEventListener("DOMContentLoaded", function () {
        halo.init();
    });

    window.onload = function() { 
        halo.initProductPage();
    }

    var halo = {
        haloTimeout: null,
        isAjaxLoading: false,

        ready: function (){
            this.loaderScript();
            this.loaderProductBlock();
            
            if (navigator.userAgent.match(/Mac OS X.*(?:Safari|Chrome)/) && ! navigator.userAgent.match(/Chrome/)) {
                document.body.classList.add('safari')
            } else {
                document.body.classList.add('chrome')
            }

            if (typeof InstallTrigger !== 'undefined') document.body.classList.add('firefox');

            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            if (isIOS) document.body.classList.add('iOS')

            if($body.hasClass('template-product')) {
                this.loaderRecommendationsBlock();
            }

            if($('[data-product-tab-block]').length) {
                this.clickedActiveProductTabs();
            }

            if ($body.hasClass('product-card-layout-07') || $body.hasClass('product-card-layout-08') ) {
                this.calculateTranslateYHeight()
            }
            
            window.sharedFunctions = {
                setLocalStorageProductForWishlist: this.setLocalStorageProductForWishlist,
                checkNeedToConvertCurrency: this.checkNeedToConvertCurrency,
                productBlockSilder: this.productBlockSilder,    
                calculateTranslateYHeight: this.calculateTranslateYHeight,
                productCountdownCard: halo.productCountdownCard,
                swapHoverVideoProductCard: halo.swapHoverVideoProductCard,
                updateSidebarCart: halo.updateSidebarCart,
            }
        },
        
        init: function () {
            this.initMultiTab();
            this.initMultiTabMobile();
            this.productBlockInfiniteScroll();
            this.initGlobalCheckbox();
            this.initColorSwatch();
            this.initAddToCart();
            this.initQuickShop();
            this.initQuickCart();
            this.initNotifyInStock();
            this.initCompareProduct();
            this.initWishlist();
            this.initAskAnExpert();
            this.initHeader();
            this.headerLanguageCurrency();
            this.headerMasonry();
            this.initLiveChat();
            this.headerSidebarSearch();
            this.headerStickySearchForm();
            this.initCountdown();
            this.collectionCountdown();
            this.handleScrollDown();
            this.initVideoPopup();
            this.swapHoverVideoProductCard();
            this.initDynamicBrowserTabTitle();
            this.initWarningPopup();
            this.clickIconScrollSection();
            this.specialBanner();
            this.formMessage();
            this.typingAnimation();
            this.spotlightproductSlider();
            this.doBeforeMegaMenuProductBlock();

            if ($('.lookbook-carousel').length) {
                this.lookbookCarousel();
            }

            // Init Quick View 
            if (window.quick_view.show || window.quick_view.show_mb) {
                this.initQuickView();
            }

            // Init Mobile Menu 
            if (window.innerWidth < 1025) {
                this.menuSidebarMobile();
                this.menuSidebarMobileToggle();
            }

            // Check Lazyload Done
            const loadingImages = document.querySelectorAll('.media--loading-effect img')
            const productGrid = document.getElementById('main-collection-product-grid')

            if (loadingImages.length > 0 || productGrid) {
                this.initLazyloadObserver(loadingImages, productGrid);
            }

            if($body.hasClass('show_effect_close')) {
                this.backgroundOverlayHoverEffect();
                this.backgroundOverlayHoverEffect1();
            }

            if($body.hasClass('template-cart')) {
                this.updateGiftWrapper();
                this.activeCheckboxStickyCartMobile();
            }

            if($body.hasClass('template-product') || $('.product-details').hasClass('featured-product')) {
                this.initProductBundle();
                this.articleGallery();
                this.toggleSidebarMobile(); 
                this.initCollapseSidebarBlock();    
                this.initCategoryActive();
                this.productCustomInformation();
                this.iconZoomClickMobile();
                this.productBlockSilderSidebar();
            }

            if($body.hasClass('template-blog') || $body.hasClass('template-article')) {
                this.initCollapseSidebarBlock();
                this.initCategoryActive();
                this.toggleSidebarMobile();
                this.initBlogMasonry();
                this.productBlockSilderSidebar();
                this.productBlockSilderArticle();
            }

            if($body.hasClass('template-article')) {
                this.articleGallery();
            }

            if($body.hasClass('template-collection') || $body.hasClass('template-search')) {
                this.initCollapseSidebarBlock();
                this.initCategoryActive();
                this.toggleSidebarMobile();
                this.productBlockSilderSidebar();
                this.initInfiniteScrolling();
                this.initQuickShopProductList();
            }

            if($body.hasClass('template-list-collections')) {
                this.toggleSidebarMobile();
                this.initCategoryActive();
                this.productBlockSilderSidebar();
            }

            if($body.hasClass('template-collection') && $('.collection-express-order').length) {
                this.toggleVariantsForExpressOrder();
                this.initExpressOrderAddToCart();
            }

            if($body.hasClass('product-card-layout-08')) {
                halo.productCountdownCard();
            }
            
            halo.checkScrollLayoutForRecenlyViewed();
            

            let checkMenuMobile;
            window.innerWidth > 1024 ? checkMenuMobile = true : checkMenuMobile = false;

            $win.on('resize', () => {
                this.headerSidebarSearch();
                this.specialBanner();
                this.specialBannerSlider();
                this.unsymmetricalSlider();
                this.doBeforeMegaMenuProductBlock();
                if (window.innerWidth > 1024) {
                    document.body.classList.remove('menu_open')
                } else if (checkMenuMobile) {
                    checkMenuMobile = false;
                    this.menuSidebarMobile()
                    this.menuSidebarMobileToggle()
                    this.initMultiTab()
                    this.initMultiTabMobile()
                }
            });
        },

        initProductPage: function () {
            if($body.hasClass('template-product') || $('.product-details').hasClass('featured-product')) {
                this.initProductView($('.halo-productView'));
            }
        },
        
        checkNeedToConvertCurrency: function () {
            var currencyItem = $('.dropdown-item[data-currency]');
            if (currencyItem.length) {
                return (window.show_multiple_currencies && typeof Currency != 'undefined' && Currency.currentCurrency != shopCurrency) || window.show_auto_currency;
            } else {
                return;
            }
        },

        loaderScript: function() {
            var load = function(){
                var script = $('[data-loader-script]');

                if (script.length > 0) {
                    script.each((index, element) => {
                        var $this = $(element),
                            link = $this.data('loader-script'),
                            top = element.getBoundingClientRect().top;

                        if (!$this.hasClass('is-load')){
                            if (top < window.innerHeight + 100) {
                                halo.buildScript(link);
                                $('[data-loader-script="' + link + '"]').addClass('is-load');
                            }
                        }
                    })
                }
            }
            
            load();
            window.addEventListener('scroll', load);
        },

        buildScript: function(name) {
            var loadScript = document.createElement("script");
            loadScript.src = name;
            document.body.appendChild(loadScript);
        },

        buildStyleSheet: function(name, $this) {
            if (name == '') return;
            const loadStyleSheet = document.createElement("link");
            loadStyleSheet.rel = 'stylesheet';
            loadStyleSheet.type = 'text/css';
            loadStyleSheet.href = name;
            $this.parentNode.insertBefore(loadStyleSheet, $this);
        },

        loaderProductBlock: function() {
            var isAjaxLoading = false;

            $doc.ajaxStart(() => {
                isAjaxLoading = true;
            });

            $doc.ajaxStop(() => {
                isAjaxLoading = false;
            });

            const handler = (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const $block = $(entry.target);
                        if ($block.hasClass('ajax-loaded')) return;

                        var url = $block.data('collection'),
                            layout = $block.data('layout'),
                            limit = $block.data('limit'),
                            image_ratio = $block.data('image-ratio'),
                            swipe = $block.data('swipe'),
                            sectionId = $block.attr('sectionId'),
                            hasCountdown = $block.attr('hasCountdown');

                        if(url != null && url != undefined) {
                            $.ajax({
                                type: 'get',
                                url: window.routes.root + '/collections/' + url,
                                cache: false,
                                data: {
                                    view: 'ajax_product_block',
                                    constraint: 'limit=' + limit + '+layout=' + layout + '+sectionId=' + sectionId + '+imageRatio=' + image_ratio + '+swipe=' + swipe + '+hasCountdown=' + hasCountdown
                                },
                                beforeSend: function () {
                                    $block.addClass('ajax-loaded');
                                },
                                success: function (data) {
                                    if (url != '') {
                                        const res = halo.handleResponse($(data), 0, limit);
                                        if (layout == 'grid') {
                                            $block.find('.products-grid').html(res);
                                        } else if (layout == 'slider'){
                                            $block.find('.products-carousel').html(res);
                                        } else if (layout == 'scroll') {
                                            $block.find('.products-flex').html(res);
                                        }
                                       
                                        $block.find('.card .variants-popup-content .selector-wrapper .swatch-element').each(function() {
                                            const $input = $(this).find('input');
                                            const $label = $(this).find('label');

                                            $input.attr({
                                                id: ($input.attr('id') || '') + sectionId,
                                                name: ($input.attr('name') || '') + sectionId
                                            });
                                            $label.attr('for', ($label.attr('for') || '') + sectionId);
                                        });

                                        $block.find('.card').each(function() {
                                            const $qsForm = $(this).find('.variants-popup-content form');
                                            const $acForm = $(this).find('.card-action form');
                                            const $select = $(this).find('.variants-popup-content select');
                                            const $acButton = $(this).find('.card-action form button');
                                            const $qsButton = $(this).find('.variants-popup-content .product-card__button2 button');

                                            $qsForm.attr('id', ($qsForm.attr('id') || '') + sectionId);
                                            $acForm.attr('id', ($acForm.attr('id') || '') + sectionId);
                                            $select.attr('id', ($select.attr('id') || '') + sectionId);
                                            $acButton.attr('data-form-id', ($acButton.attr('data-form-id') || '') + sectionId);
                                            $qsButton.attr('data-form-id', ($qsButton.attr('data-form-id') || '') + sectionId);
                                        });

                                    }
                                },
                                complete: function () {
                                    if (layout == 'slider') {
                                        halo.productBlockSilder($block);
                                    }

                                    if ($block.hasClass('special-banner__product') && layout == 'grid' && window.innerWidth < 1200) {
                                        $block.find('.special-banner__products--grid').addClass('products-carousel');
                                        halo.productBlockSilder($block);
                                    }

                                    if ($block.hasClass("halo-block-unsymmetrical") && layout == 'grid' && window.innerWidth < 1200) {
                                        halo.unsymmetricalSlider($block);
                                    }
                                    
                                    if(window.compare.show){
                                        var $compareLink = $('[data-compare-link]');

                                        halo.setLocalStorageProductForCompare($compareLink);
                                    }

                                    halo.swapHoverVideoProductCard();

                                    if(window.wishlist.show){
                                        halo.setLocalStorageProductForWishlist();
                                    }

                                    if (halo.checkNeedToConvertCurrency()) {
                                        Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                                    };

                                    if ($('body').hasClass('cursor-fixed__show')){
                                        window.sharedFunctionsAnimation.onEnterButton();
                                        window.sharedFunctionsAnimation.onLeaveButton();
                                    }

                                    if($body.hasClass('product-card-layout-08')) {
                                        halo.productCountdownCard();
                                    }

                                    if ($body.hasClass('product-card-layout-07') || $body.hasClass('product-card-layout-08')) {
                                        halo.calculateTranslateYHeight()
                                    }
                                }
                            });
                        } else {
                            $block.addClass('ajax-loaded');

                            if (layout == 'slider') {
                                halo.productBlockSilder($block);
                            }

                            if (halo.checkNeedToConvertCurrency()) {
                                Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                            };
                        }
                    }
                })
            }

            this.productBlock = document.querySelectorAll('[data-product-block]');

            const config = {
                rootMargin: '0px 0px 200px 0px',
            }

            this.observer = new IntersectionObserver(handler, config);
            this.productBlock.forEach(block => {
                this.observer.observe(block);
            });
        },

        handleResponse($res, productToShow, limit) {
            $res = $res.splice(productToShow, limit);
            return $res
        },

        loaderRecommendationsBlock: function(){
            halo.buildRecommendationBlock();
        },

        headerMasonry: function(){
            $('.menu-dropdown__wrapper [data-masonry]').masonry({
              columnWidth: '.grid-sizer',
              itemSelector: '[data-gridItem]'
            });
        },

        initLiveChat: function () {
            var $item_globe = $('.live-wrapper-icon');
            $item_globe.on('click', function (e) {
                $(this).parent().toggleClass('live_help--active');          
            });

            $body.on('click', function (e) {
                if(($('.live_help').hasClass('live_help--active')) && ($(event.target).closest('.live_help').length === 0)){
                    e.preventDefault();
                    $('.live_help').removeClass('live_help--active');
                }
            });
        },

        initHeader: function() {
            const headerAll = document.querySelectorAll('[class*="section-header"]')
            if (headerAll) {
                let index = headerAll.length + 20;
                headerAll.forEach((element) => {
                    if (element.classList.contains('section-header-mobile')) return;
                    element.setAttribute('data-index', index);
                    element.style.zIndex = index;
                    index--
                })

                const headerBasicTransparent = document.querySelector('.header-basic--transparent')
                if (headerBasicTransparent && document.body.classList.contains('template-index')) {
                    const height = headerBasicTransparent.offsetHeight,
                        navTransparent = document.querySelector('.header-navigation[class*="--transparent"]')
                    if (navTransparent) {
                        navTransparent.style.top = `${height}px`
                        navTransparent.classList.add('has-top')
                    }
                }
            }
        },

        headerLanguageCurrency: function() {
            if (!document.querySelector('.header-language_currency')) return;
            const header = document.querySelectorAll('[class*="section-header-"]')

            document.addEventListener('click', (event) => {
                const $target = event.target;
                const $headerLanguageCurrency = $target.closest('.header-language_currency');
                const languageCurrency = $headerLanguageCurrency?.querySelector('.top-language-currency');
                const dropdownCurrency = $headerLanguageCurrency?.querySelector('.dropdown-currency');
                const dropdownLanguage = $headerLanguageCurrency?.querySelector('.dropdown-language');

                if ($target.matches('.header-language_currency') || $target.closest('.header-language_currency')) {
                    if ($target.matches('.icon-languageCurrency') || $target.closest('.icon-languageCurrency')) {
                        languageCurrency?.classList.toggle('show')
                    }
                    else if (($target.matches('.top-language-currency') || $target.closest('.top-language-currency')) && !document.querySelector('.icon-languageCurrency')) {
                        languageCurrency?.classList.toggle('show')
                    }

                    if ($target.matches('.halo-top-currency') || $target.closest('.halo-top-currency')) {
                        dropdownLanguage?.classList.remove('show')
                        dropdownCurrency?.classList.toggle('show')
                    }
                    
                    if ($target.matches('.halo-top-language') || $target.closest('.halo-top-language')) {
                        dropdownCurrency?.classList.remove('show')
                        dropdownLanguage?.classList.toggle('show')
                    }

                    if ($target.matches('.dropdown-menu .dropdown-item')) {
                        dropdownCurrency?.classList.remove('show')
                        dropdownLanguage?.classList.remove('show')
                    }
                }
                else {
                    header.forEach(element => {
                        element.querySelector('.top-language-currency')?.classList.remove('show')
                        element.querySelector('.dropdown-currency')?.classList.remove('show')
                        element.querySelector('.dropdown-language')?.classList.remove('show')
                    })
                }
            })
        },

        headerSidebarSearch: function() {
            var headerSearchPC = $('.header-top .header__search .search_details'),
                headerSearchMB = $('#search-form-mobile .halo-sidebar-wrapper .search_details'),
                headerwraperSearchPC = $('.header-top .header__search'),
                headerwraperSearchMB = $('#search-form-mobile .halo-sidebar-wrapper'),
                searchDetails = $('.search_details'),
                predictiveSearchPC =  $('.header-top .header__search predictive-search'),
                predictiveSearchMB = $('#search-form-mobile .halo-sidebar-wrapper predictive-search');
 
             if (predictiveSearchPC.length === 0) predictiveSearchPC =  $('.header-top .header__search .search_details');
             if (predictiveSearchMB.length === 0) predictiveSearchMB =  $('#search-form-mobile .halo-sidebar-wrapper .search_details');
            if (window.innerWidth < 1025) {
                if($('.header').hasClass('header-01')){
                    predictiveSearchPC.appendTo(headerwraperSearchMB);
                }
                searchDetails.attr('open','true');
                $('[data-search-mobile]').on('click', (event) => {
                    event.preventDefault();
                    $('body').addClass('open_search_mobile');
                });
                $('[data-search-close-sidebar], .background-overlay').on('click', (event) => {
                    event.preventDefault();
                    $('body').removeClass('open_search_mobile');
                });
            }else{
                if($('.header').hasClass('header-01')){
                    predictiveSearchMB.appendTo(headerwraperSearchPC);
                }
                searchDetails.removeAttr('open');

                $('.search-modal__close-button').on('click', (event) => {
                    $('.search_details').removeAttr('open');
                    $('body').removeClass('open_search_menu');
                });

                // Click Search Icon On Header Nav And Sticky Menu
                $('[data-search-menu]').on('click', (event) => {
                    event.preventDefault();
                    $('body').addClass('open_search_menu');
                });
            }
        },

        headerStickySearchForm: function() {
            var iconSearchSlt = '[data-search-sticky-form]';
            var iconSearchMenu = '[data-search-menu-sticky-form] .icon-search';
            var iconSearchMenuCustom = '[data-search-menu-sticky-form] .icon-search-custom';

            if ($(window).width() > 1025) {
                $(document).off('click.toggleSearch', iconSearchSlt).on('click.toggleSearch', iconSearchSlt, function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $('body').addClass('sticky-search-open');
                    $('.search_details').attr('open','true');
                });

                $(document).off('click.hideSearch').on('click.hideSearch', function(event) {
                    var formSearch = $('.search-modal__form'),
                        quickSearch = $('.quickSearchResultsWrap');
                    if ($('body').hasClass('sticky-search-open') && !formSearch.has(event.target).length && !quickSearch.has(event.target).length && !$(event.target).hasClass('search-modal__content') && $(event.target).closest('.search-modal__content').length == 0) {
                        $('body').removeClass('sticky-search-open');
                        $('[class*="section-header-"]').removeClass('sticky-search-menu-open');
                        $('.search_details').removeAttr('open');
                    }
                });

                // Click Search Icon On Header Nav And Sticky Menu
                $(document).off('click.toggleSearch', iconSearchMenu).on('click.toggleSearch', iconSearchMenu, function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $(event.target).closest('[class*="section-header-"]').addClass('sticky-search-menu-open');
                    $(event.target).closest('.section-header-navigation').css('z-index', '101');
                    $('.search_details').attr('open','true');
                });

                // Click Search Icon On Header Hamburger - Search Dropdown Style Layout Custom
                $(document).off('click.toggleSearch', iconSearchMenuCustom).on('click.toggleSearch', iconSearchMenuCustom, function(event) {
                    $(event.target).closest('[class*="section-header-"]').addClass('sticky-search-menu-custom-open');
                });

                $(document).off('click.hideSearchSticky').on('click.hideSearchSticky', function(event) {
                    var formSearch = $('.header-navigation .search-modal__form'),
                        quickSearch = $('.header-navigation .quickSearchResultsWrap');
                    if ($('[class*="section-header-"]').hasClass('sticky-search-menu-open') && !formSearch.has(event.target).length && !quickSearch.has(event.target).length && !$(event.target).hasClass('search-modal__content') && $(event.target).closest('.search-modal__content').length == 0) {
                        const header = $(iconSearchMenu).closest('.section-header-navigation');
                        const index = header.data('index');

                        $('[class*="section-header-"]').removeClass('sticky-search-menu-open');
                        
                        header.css('z-index', index);
                        $('.header-navigation .search_details').removeAttr('open');
                        if(quickSearch.hasClass('is-show')) {
                            quickSearch.removeClass('is-show').addClass('hidden')
                        }
                    }
                    if (($(event.target).closest('.search-modal__content').length === 0)){
                        $('body').removeClass('open_search_menu');
                        $('[class*="section-header-"]').removeClass('sticky-search-menu-custom-open');
                    }
                });
            }
        },

        menuSidebarMobile: function() {
            var buttonIconOpen = $('.mobileMenu-toggle'),
                buttonClose = $('.halo-sidebar-close, .background-overlay');

            const menuSidebarMobileOpen = () => {
                $body.addClass('menu_open');
                $('.list-menu-loading').remove();
                if(window.mobile_menu == 'default'){
                    if(!$('#navigation-mobile .site-nav-mobile.nav .header__inline-menu').length){
                        $('.header .header__inline-menu').appendTo('#navigation-mobile .site-nav-mobile.nav');
                    }
                }
                if(!$('#navigation-mobile .site-nav-mobile.nav-account .free-shipping-text').length){
                    $('.header-top--wrapper .header-top--right .free-shipping-text').appendTo('#navigation-mobile .site-nav-mobile.nav-account .wrapper-links');
                }
                if(!$('#navigation-mobile .site-nav-mobile.nav-account .customer-service-text').length){
                    $('.header-top--wrapper .header-top--right .customer-service-text').appendTo('#navigation-mobile .site-nav-mobile.nav-account .wrapper-links');
                }
                if(!$('#navigation-mobile .site-nav-mobile.nav-account .header__location').length){
                    $('.header-top--wrapper .header-top--right .header__location').appendTo('#navigation-mobile .site-nav-mobile.nav-account .wrapper-links');
                }
                if(!$('#navigation-mobile .top-language-currency').length){
                    if($('.header').hasClass('header-03')){
                        $('.header .header-bottom-right .top-language-currency').appendTo('#navigation-mobile .site-nav-mobile.nav-currency-language');
                    }else if($('.header').hasClass('header-05')){
                        $('.header .header-top--left .top-language-currency').appendTo('#navigation-mobile .site-nav-mobile.nav-currency-language');
                    }else{
                        $('.header .header-language_currency .top-language-currency').appendTo('#navigation-mobile .site-nav-mobile.nav-currency-language');
                    }
                }
            }

            if (document.body.matches('.menu_open')) {
                menuSidebarMobileOpen();
            }

            buttonIconOpen.off('click.toggleCurrencyLanguage').on('click.toggleCurrencyLanguage', (event) =>{
                event.preventDefault();
                menuSidebarMobileOpen();
            });

            buttonClose.off('click.toggleCloseCurrencyLanguage').on('click.toggleCloseCurrencyLanguage', () =>{
                $body.removeClass('menu_open');
                $('#navigation-mobile').off('transitionend.toggleCloseMenu').on('transitionend.toggleCloseMenu', () => {
                    if (!$body.hasClass('menu_open')) {

                        if(!$('.header .header__inline-menu').length){
                            if($('.header').hasClass('header-03') || $('.header').hasClass('header-04') || $('.header').hasClass('header-07') || $('.header').hasClass('header-08')){
                                $('#navigation-mobile .site-nav-mobile.nav .header__inline-menu').appendTo('.header .header-bottom--wrapper .header-bottom-left');
                            }else{
                                $('#navigation-mobile .site-nav-mobile.nav .header__inline-menu').appendTo('.header .header-bottom--wrapper');
                            }
                        }
                        if(!$('.header-top--wrapper .header-top--right .free-shipping-text').length){
                            if(!$('.header-04').hasClass('style_2')){
                                $('#navigation-mobile .site-nav-mobile.nav-account .free-shipping-text').insertBefore('.header-top--wrapper .header-top--right .header__group');
                            }
                        }
                        if(!$('.header-top--wrapper .header-top--right .header__location').length){
                            $('#navigation-mobile .site-nav-mobile.nav-account .header__location').insertBefore('.header-top--wrapper .header-top--right .header__group');
                        }
                        if(!$('.header-top--wrapper .header-top--right .customer-service-text').length){
                            if($('.header').hasClass('header-03')){
                                $('#navigation-mobile .site-nav-mobile.nav-account .customer-service-text').insertBefore('.header-top--wrapper .header-top--right .header__group .header__icon--wishlist');
                            }else{
                                $('#navigation-mobile .site-nav-mobile.nav-account .customer-service-text').insertBefore('.header-top--wrapper .header-top--right .top-language-currency');
                            }
                        }
                        if(!$('.header-language_currency .top-language-currency').length){
                            if($('.header').hasClass('header-03')){
                                $('#navigation-mobile .site-nav-mobile .top-language-currency').appendTo('.header .header-bottom--wrapper .header-bottom-right .header-language_currency');
                            }else if($('.header').hasClass('header-04')){
                                $('#navigation-mobile .site-nav-mobile .top-language-currency').appendTo('.header .header-bottom--wrapper .header-bottom-right .header-language_currency');
                            }else if($('.header').hasClass('header-05')){
                                $('#navigation-mobile .site-nav-mobile .top-language-currency').appendTo('.header .header-top--wrapper .header-top--left .header-language_currency');
                            }else{
                                $('#navigation-mobile .site-nav-mobile .top-language-currency').insertBefore('.header .header-language_currency .header__search');
                            }
                        }
                    }
                })
                    
            });

            $doc.on('click', '.halo-sidebar-close', function (e) {
                e.preventDefault();
                e.stopPropagation();
                $body.removeClass('menu_open');
            });
        },

        menuSidebarMobileToggle: function() {
            $body.on('click', '.site-nav-mobile .list-menu .menu_mobile_link', function (e) {
                if(!e.currentTarget.classList.contains('list-menu__item--end')){
                    e.preventDefault();
                    e.stopPropagation();
                    var $target = $(this);
                    var $parent = $target.parent();
                    var $menuDislosure1 = $target.parent().find('ul.list-menu--disclosure-1');

                    $parent.removeClass('is-hidden').addClass('is-open').removeClass('d-none');
                    $menuDislosure1.off('transitionend.toggleMenuLink1').on('transitionend.toggleMenuLink1', () => {
                        if ($parent.hasClass('is-open') && !$parent.hasClass('is-hidden') && !$parent.hasClass('d-none')) {
                            // $parent.addClass('d-none')
                            $parent.siblings().removeClass('is-open').addClass('is-hidden').removeClass('d-none');
                        }
                    })

                    // $target.parent().siblings().removeClass('is-open').addClass('is-hidden');
                    // $target.parent().removeClass('is-hidden').addClass('is-open');
                }
            });

            $body.on('click', '.site-nav-mobile .list-menu .menu_mobile_link_2', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var $target = $(this);
                var $target = $(this);
                var $parent = $target.parent().parent();
                var $menuDislosure2 = $target.parent().find('ul.list-menu--disclosure-2');
                var $parentToScroll = $target.parent().parent().parent().parent().parent().parent();

                $parent.removeClass('is-hidden').addClass('is-open').removeClass('d-none');
                $menuDislosure2.off('transitionend.toggleMenuLink2').on('transitionend.toggleMenuLink2', () => {
                    if ($parent.hasClass('is-open') && !$parent.hasClass('is-hidden') && !$parent.hasClass('d-none')) {
                        $parent.addClass('d-none')
                        $parent.siblings().removeClass('is-open').addClass('is-hidden').removeClass('d-none');
                        $parentToScroll.animate({
                            scrollTop: 0
                        }, 0);
                    }
                })

                // if($('.header').hasClass('header-04') || $('.header').hasClass('header-01') || $('.header').hasClass('header-02')){
                    // $target.parent().parent().siblings().removeClass('is-open').addClass('is-hidden');
                    // $target.parent().parent().removeClass('is-hidden').addClass('is-open');
                    // $target.parent().parent().parent().parent().parent().parent().animate({
                    //     scrollTop: 0
                    // }, 0);
                // } else{
                //     $target.parents('.site-nav').siblings().removeClass('is-open').addClass('is-hidden');
                //     $target.parents('.site-nav').removeClass('is-hidden').addClass('is-open');
                //     $target.parents('.menu-dropdown__wrapper').animate({
                //         scrollTop: 0
                //     }, 0);
                // }

                if($('.menu-dropdown').hasClass('megamenu_style_5') || $('.menu-dropdown').hasClass('megamenu_style_4') || $('.menu-dropdown').hasClass('megamenu_style_3') || $('.menu-dropdown').hasClass('megamenu_style_2') || $('.menu-dropdown').hasClass('megamenu_style_1')){
                    $target.parents('.menu-dropdown').animate({
                        scrollTop: 0
                    }, 0);
                }

                $target.parents('.menu-dropdown').addClass('is-overflow');
            });

            $body.on('click', '.nav-title-mobile', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var $target = $(this),
                    $parentLv1 = $target.parent().parent().parent().parent('.is-open'),
                    $parentLv2 = $target.parent().parent().parent('.is-open'),
                    $parentLv3 = $target.parent().parent('.is-open');

                $parentLv1.siblings().removeClass('is-hidden');
                $parentLv1.removeClass('is-open').removeClass('d-none');
                $parentLv2.siblings().removeClass('is-hidden');
                $parentLv2.removeClass('is-open').removeClass('d-none');
                $parentLv3.siblings().removeClass('is-hidden');
                $parentLv3.removeClass('is-open').removeClass('d-none');
                $('.menu-dropdown').removeClass('is-overflow');
            });

            if(window.mobile_menu != 'default'){
                $doc.on('click', '[data-mobile-menu-tab]', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    var tabItem = event.currentTarget.closest('li'),
                        tabTarget = event.currentTarget.dataset.target;

                    if(!tabItem.classList.contains('is-active')){

                        document.querySelector('[data-navigation-tab-mobile]').querySelectorAll('li').forEach((element) =>{
                            if(element != tabItem){
                                element.classList.remove('is-active');
                            } else {
                                element.classList.add('is-active');

                                document.querySelectorAll('[id^="MenuMobileListSection-"]').forEach((tab) =>{
                                    if(tab.getAttribute('id') == tabTarget) {
                                        tab.classList.remove('is-hidden');
                                        tab.classList.add('is-visible');
                                    } else {
                                        tab.classList.remove('is-visible');
                                        tab.classList.add('is-hidden');
                                    }
                                });
                            }
                        });
                    }
                });
            };

            $(document).on('click', '[data-navigation-mobile] .no-megamenu .menu-lv-1__action', (event) => {
                const hash = $(event.currentTarget).attr('href').split('#')[1];

                if (hash != undefined && hash != '' && $(`#${hash}`).length) {
                    $('body').removeClass('menu_open');
                    $('html, body').animate({
                        scrollTop: $(`#${hash}`).offset().top
                    }, 700);
                }
            })
        },

        setCookie(cname, cvalue, exdays){
            const d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            const expires = 'expires=' + d.toUTCString();
            document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
        },

        initMultiTab: function() {
            let designMode, showMenu, check = true;
            document.body.matches('.shopify-design-mode') ? designMode = true : designMode = false;
            document.body.matches('.menu_open') ? showMenu = true : showMenu = false;
                
            const loadMenuDefault = () => {
                if (check) {
                    check = false;
                    halo.initMobileMenuDefault(url)
                }
            }

            const loadMenuTab = () => {
                if (check) {
                    check = false;
                    halo.initMultiTabMobile()
                }
            }
            
            if($('[data-menu-tab]').length > 0){
                
                var active = $('[data-menu-tab] li.is-active').data('load-page'),
                    url = window.routes.root + `/search?type=product&q=${active}&view=ajax_mega_menu`;
              
                if($body.hasClass('template-index')){
                    if ($win.width() < 1025) {
                        if(window.mobile_menu == 'default'){
                            window.addEventListener('load', () => {
                                if (designMode || showMenu) {
                                    loadMenuDefault();
                                }
                                else {
                                    document.body.addEventListener('click', () => {
                                        loadMenuDefault();
                                    }, false)
                                }
                            }, false)
                        } else {
                            window.addEventListener('load', () => {
                                if (designMode || showMenu) {
                                    loadMenuTab();
                                }
                                else {
                                    document.body.addEventListener('click', () => {
                                        loadMenuTab();
                                    }, false)
                                }
                            }, false)
                        }
                    }
                } else {
                    if ($win.width() < 1025) {
                        if(window.mobile_menu == 'default'){
                            window.addEventListener('load', () => {
                                if (designMode || showMenu) {
                                    loadMenuDefault();
                                }
                                else {
                                    document.body.addEventListener('click', () => {
                                        loadMenuDefault();
                                    }, false)
                                }
                             }, false)
                        } else {
                            window.addEventListener('load', () => {
                                if (designMode || showMenu) {
                                    loadMenuTab();
                                }
                                else {
                                    document.body.addEventListener('click', () => {
                                        loadMenuTab();
                                    }, false)
                                }
                            }, false)
                        }
                    }
                }
            } else {
                var url = window.routes.root + '/search?view=ajax_mega_menu';

                if ($win.width() < 1025) {
                    if (window.mobile_menu == "default") {
                        if (designMode || showMenu) {
                            loadMenuDefault();
                        }
                        else {
                            document.body.addEventListener("click",() => {
                                loadMenuDefault();
                            }, false)
                        }
                    } else {
                        window.addEventListener("load",() => {
                            if (designMode || showMenu) {
                                loadMenuTab();
                            }
                            else {
                                document.body.addEventListener("click",() => {
                                    loadMenuTab();
                                }, false)
                            }
                        }, false)
                    }
                }
            }
        },

        initMobileMenuDefault: function(url) {
            const menuMobile = $('[data-navigation-mobile]');
            const nav = $('#HeaderNavigation [data-navigation]');
            const style = nav.attr('style') != undefined ? nav.attr('style') : nav.closest('#HeaderNavigation').attr('style');
            $('.list-menu-loading').remove();
            menuMobile.append(`<nav class="header__inline-menu" data-navigation role="navigation" style="${style != undefined ? style : ''}">${nav.html() != undefined ? nav.html() : ''}</nav>`);

            const topLanCur = $('.top-language-currency');
            const lanCurMobile = $('#navigation-mobile .nav-currency-language');
            if (lanCurMobile.text().trim() == '' && topLanCur.length > 0) lanCurMobile.append(`<div class="top-language-currency">${topLanCur.html()}</div>`)

            // Menu Mobile Tab on Header Vertical
            const menuVertical = document.querySelector('.header-nav-vertical-menu .vertical-menu .header__menu-vertical')
            if(menuVertical){
              document.querySelector('.halo-sidebar.halo-sidebar_menu').classList.add('has-menu-vertical')

              const menuVerticalTitle = document.querySelector('.header-nav-vertical-menu .vertical-menu .categories-title__button .title').innerHTML
              const navMobile =  document.querySelector('.site-nav-mobile.nav')
              const navMobileTitle =  navMobile.querySelector('.menu-heading-mobile')
              const span = document.createElement('span')
              span.classList.add('title')
              span.innerHTML = menuVerticalTitle;
              navMobileTitle.appendChild(span);
              navMobile.appendChild(menuVertical);
            
              const menuVerticalNav = document.querySelector('.site-nav-mobile.nav .header__menu-vertical')
              menuVerticalNav.classList.add('header__inline-menu')
            
              const tabTitle = document.querySelectorAll('.site-nav-mobile.nav .menu-heading-mobile .title')
              const mobileMenu = document.querySelectorAll('.site-nav-mobile.nav .header__inline-menu')
              tabTitle[0].classList.add('is-active')
              mobileMenu[0].classList.add('is-active')
              
              tabTitle.forEach((item,index) => {
                item.addEventListener('click', ()=> {
                  tabTitle.forEach(e => e.classList.remove('is-active'))
                  item.classList.add('is-active')
                  mobileMenu.forEach(e => e.classList.remove('is-active'))
                  mobileMenu[index].classList.add('is-active')
                })
              })
            }

            if (window.innerWidth < 1025) {
                var menuItemMega = $('.menu-lv-item.has-megamenu');

                if (menuItemMega.length > 0) {
                    menuItemMega.on('click', function (e) {
                        var block = $(this).find('.menu-dropdown__block--content .products-carousel');
                        var handle = block.data('product');
                        var url = block.data('collection');
                        var url_handle;

                        if (block.hasClass('megamenu_1')) {
                            if (handle) {
                                url_handle = window.routes.root + '/products/' + handle;
                            }
                        } else if (block.hasClass('megamenu_5')) {
                            if (url) {
                                url_handle = window.routes.root + '/collections/' + url;
                            }
                        }

                        if (url_handle) {
                            halo.renderMegaMenuProductBlock(block, url_handle);
                        }
                    });
                }
            }
        },

        initMultiTabMobile: function() {
            if ($win.width() < 1025) {
                if(window.mobile_menu == 'custom'){
                    var chk = true,
                        menuElement = $('[data-section-type="menu"]'),
                        menuMobile = $('[data-navigation-mobile]'),
                        menuTabMobile = $('[data-navigation-tab-mobile]');

                    const loadMenu = () => {
                        if (chk) {
                            chk = false;
                            const content = document.createElement('div');
                            const tab = document.createElement('ul');
                            
                            Object.assign(tab, {
                                className: 'menu-tab list-unstyled'
                            });
                            
                            tab.setAttribute('role', 'menu');
                            
                            menuElement.each((index, element) => {
                                var currentMenu = element.querySelector('template').content.firstElementChild.cloneNode(true);
                                
                                if(index == 0){
                                    currentMenu.classList.add('is-visible'); 
                                } else {
                                    currentMenu.classList.add('is-hidden');
                                }
                                
                                content.appendChild(currentMenu);
                            });

                            content.querySelectorAll('[id^="MenuMobileListSection-"]').forEach((element, index) => {
                                var tabTitle = element.dataset.heading,
                                    tabId = element.getAttribute('id'),
                                    tabElement = document.createElement('li');

                                Object.assign(tabElement, {
                                    className: 'item'
                                });

                                tabElement.setAttribute('role', 'menuitem');

                                if (index == 0) {
                                    tabElement.classList.add('is-active');
                                }

                                tabElement.innerHTML = `<a role="link" aria-disabled="true" class="link" data-mobile-menu-tab data-target="${tabId}">${tabTitle}</a>`;

                                tab.appendChild(tabElement);
                            });

                            $('.list-menu-loading').remove();
                            menuTabMobile.html(tab);
                            menuMobile.html(content.innerHTML);
                        }

                    }

                    if ($('.header-nav-plain .header-language_currency').length > 0){
                        const topLanCur = $('.top-language-currency');
                        const lanCurMobile = $('#navigation-mobile .nav-currency-language');
                        if (lanCurMobile.text().trim() == '' && topLanCur.length > 0) lanCurMobile.append(`<div class="top-language-currency">${topLanCur.html()}</div>`)
                    }

                    if (document.body.matches('.menu_open')) {
                        loadMenu();
                    }

                    document.body.addEventListener('click', () => {
                        loadMenu();
                    });                    
                }
            }

            if (window.innerWidth < 1025) {
                var menuItemMega = $('.menu-lv-item.has-megamenu');

                if (menuItemMega.length > 0) {
                    menuItemMega.on('click', function (e) {
                        var block = $(this).find('.menu-dropdown__block--content .products-carousel');
                        var handle = block.data('product');
                        var url = block.data('collection');
                        var url_handle;

                        if (block.hasClass('megamenu_1')) {
                            if (handle) {
                                url_handle = window.routes.root + '/products/' + handle;
                            }
                        } else if (block.hasClass('megamenu_5')) {
                            if (url) {
                                url_handle = window.routes.root + '/collections/' + url;
                            }
                        }

                        if (url_handle) {
                            halo.renderMegaMenuProductBlock(block, url_handle);
                        }
                    });
                }
            }
        },
        
        clickedActiveProductTabs: function() {
            const handler = (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const $block = $(entry.target);
                        if ($block.hasClass('ajax-loaded')) return;

                        var listTabs = $block.find('ul.list-product-tabs'),
                            tabLink = listTabs.find('[data-product-tabTop]'),
                            tabContent = $block.find('[data-product-TabContent]'),
                            limit = $block.data('limit');

                        var linkActive = listTabs.find('.tab-links.active'),
                            activeTab = $block.find('.product-tabs-content .tab-content.active');
                            
                        if (!$block.hasClass('ajax-loaded')) {
                            halo.doAjaxProductTabs(
                                linkActive.data('href'), 
                                activeTab.find('.loading'), 
                                activeTab.find('.products-load'), 
                                $block.find("button.tab-links.active").attr('data-section-index'), 
                                limit,
                                $block
                            );
                        }
                        
                        tabLink.off('click').on('click', function (e) {
                            e.preventDefault();
                            e.stopPropagation();

                            if (!$(this).hasClass('active')) {

                                $('.list-tabs-popup.show-dropdown')?.removeClass('show-dropdown');
                                $(this).closest('.dropdown').find('.label-active .tab-links').text($(this).text());

                                const curTab = $(this),
                                    curTabContent = $(curTab.data('target'));

                                tabLink.removeClass('active');
                                tabContent.removeClass('active');

                                if (!curTabContent.hasClass('loaded')) halo.doAjaxProductTabs(curTab.data('href'), curTabContent.find('.loading'), curTabContent.find('.products-load'), $block.find("button.tab-links.active").attr('data-section-index'), limit);
                                
                                curTab.addClass('active');
                                curTabContent.addClass('active');
                                curTabContent.find('.slick-slider').slick('refresh');
                            };
                        });
                        
                        $('.product-tab-block .dropdown .label-active .list-product-tabs').off('click').on('click', function (e) {
                            document.querySelector(".list-tabs-popup").classList.toggle("show-dropdown");
                        });
                    }
                })
            }

            this.productBlock = document.querySelectorAll('[data-product-tab-block]');

            const config = {
                threshold: 0.1,
            }

            this.observer = new IntersectionObserver(handler, config);
            this.productBlock.forEach(block => {
                this.observer.observe(block);
            });
        },

        doAjaxProductTabs: function (handle, loadingElm, curTabContent, sectionId, limit, self) {
            $.ajax({
                type: "get",
                url: handle,
                data: {
                    constraint: `sectionId=${handle}+limit=${limit}`
                },

                beforeSend: function () {
                    if (self != undefined) self.addClass('ajax-loaded');
                },

                success: function (data) {
                    curTabContent.parent().addClass('loaded');
                    if (handle == '?view=ajax_product_block') return;
                    
                    if ($(data).text().trim() === '') {
                        noProduct(curTabContent);
                    }
                    else {
                        const res = halo.handleResponse($(data), 0, limit);
                        curTabContent.html(res);

                        if(window.wishlist.show){
                            halo.setLocalStorageProductForWishlist();
                        }

                        if (halo.checkNeedToConvertCurrency()) {
                            Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                        };
                                       
                        curTabContent.parent().find('.card .variants-popup-content .selector-wrapper .swatch-element').each(function() {
                            const $input = $(this).find('input');
                            const $label = $(this).find('label');

                            $input.attr({
                                id: ($input.attr('id') || '') + sectionId,
                                name: ($input.attr('name') || '') + sectionId
                            });
                            $label.attr('for', ($label.attr('for') || '') + sectionId);
                        });
                    }

                    halo.swapHoverVideoProductCard();
                },
                complete: function () {
                    if (curTabContent.hasClass('products-carousel')) {
                        halo.productBlockSilder(curTabContent.parent());
                    }

                    if ($('body').hasClass('cursor-fixed__show')){
                        window.sharedFunctionsAnimation.onEnterButton();
                        window.sharedFunctionsAnimation.onLeaveButton();
                    }

                    if ($body.hasClass('product-card-layout-07') || $body.hasClass('product-card-layout-08')) {
                        halo.calculateTranslateYHeight()
                    }

                    if($body.hasClass('product-card-layout-08')) {
                        halo.productCountdownCard();
                    }
                },
                error: function (xhr, text) {
                    noProduct(curTabContent);
                }
            });
            
            const noProduct = (curTabContent) => {
                curTabContent.html(`<p class="loading center">Sorry, there are no products in this collection</p>`);
            }
        },
        lookbookCarousel: function() {
            var lookbookCarousel = $('.lookbook-carousel'),
                itemToShow = lookbookCarousel.data('item-to-show'),
                itemDots = lookbookCarousel.data('item-dots'),
                itemDotsMb = lookbookCarousel.data('item-dots-mb'),
                itemArrows = lookbookCarousel.data('item-arrows'),
                itemArrowsMb = lookbookCarousel.data('item-arrows-mb');

            if(lookbookCarousel.length > 0) {
                if(lookbookCarousel.not('.slick-initialized')) {
                    lookbookCarousel.slick({
                        mobileFirst: true,
                        adaptiveHeight: true,
                        vertical: false,
                        infinite: true,
                        slidesToShow: itemToShow,
                        slidesToScroll: itemToShow,
                        arrows: itemArrowsMb,
                        dots: itemDotsMb,
                        autoplay: false,
                        nextArrow: window.arrows.icon_next,
                        prevArrow: window.arrows.icon_prev,
                        rtl: window.rtl_slick,
                        responsive: 
                        [
                            {
                                breakpoint: 1024,
                                settings: {
                                    arrows: itemArrows,
                                    dots: itemDots
                                }
                            }
                        ]
                    });
                }
            }

            if (lookbookCarousel.hasClass('enable_counter_number')) {
                var slickNext = lookbookCarousel.find('.slick-next');
                lookbookCarousel.closest('.special-banner__item--lookbook_banner').find('.products-counter-number').appendTo(slickNext);
                lookbookCarousel.on('afterChange', (event) => {
                    var slickIndex = lookbookCarousel.find('.slick-current').data('slick-index');
                    lookbookCarousel.find("#count-image").text(slickIndex + 1);
                });
            }

            if ($('body').hasClass('cursor-fixed__show')){
                window.sharedFunctionsAnimation.onEnterButton();
                window.sharedFunctionsAnimation.onLeaveButton();
            }
        },
        productBlockSilder: function(wrapper) {
            var productGrid = wrapper.find('.products-carousel'),
                itemToShow = productGrid.data('item-to-show'),
                itemDots = productGrid.data('item-dots'),
                itemDotsMb = productGrid.data('item-dots-mb'),
                itemArrows = productGrid.data('item-arrows'),
                itemArrowsMb = productGrid.data('item-arrows-mb'),
                itemInfinite = productGrid.data('infinite'),
                itemAutoplay = productGrid.data('autoplay'),
                swatchLabel = productGrid.find('.swatch .swatch-label'),
                isProductCard06 = document.body.classList.contains('product-card-layout-06');

            if(productGrid.length > 0) {
                if(productGrid.hasClass('slick-initialized')) return;
                if(productGrid.not('.slick-initialized')) {
                    if (isProductCard06) {
                        productGrid.on('init', () => {
                            const selectOptionsHeight = productGrid.find('.product .card-action').eq(0).height();
                            productGrid.find('.slick-list').css('padding-bottom', selectOptionsHeight + 'px');
                            productGrid.attr('data-slider-padding-bottom', selectOptionsHeight)
                        })
                    }

                    if (productGrid.hasClass('enable_progress_bar')) {
                        var progressBar = wrapper.find('.scrollbar-thumb');
                        productGrid.on('init', (event, slick) => {
                            var percent = ((slick.currentSlide / (slick.slideCount - itemToShow)) * 100) + '%';
                            progressBar.css('--percent', percent);
                        });
                    }
                  
                    productGrid.slick({
                        mobileFirst: true,
                        adaptiveHeight: true,
                        vertical: false,
                        infinite: itemInfinite,
                        autoplay: itemAutoplay,
                        speed: 1000,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        arrows: itemArrowsMb,
                        dots: itemDotsMb,
                        nextArrow: window.arrows.icon_next,
                        prevArrow: window.arrows.icon_prev,
                        rtl: window.rtl_slick,
                        responsive: 
                        [
                            {
                                breakpoint: 1599,
                                settings: {
                                    arrows: itemArrows,
                                    dots: itemDots,
                                    autoplay: false,
                                    get slidesToShow() {
                                        if(itemToShow !== undefined && itemToShow !== null && itemToShow !== ''){
                                            return this.slidesToShow = itemToShow;
                                        } else {
                                            return this.slidesToShow = 1;
                                        }
                                    },
                                    get slidesToScroll() {
                                        if(itemToShow !== undefined && itemToShow !== null && itemToShow !== '' && itemToShow !== 2.5 && itemToShow !== 3.5 && itemToShow !== 4.5 && itemToShow !== 5.5){
                                            return this.slidesToScroll = itemToShow;
                                        } else {
                                            return this.slidesToScroll = 1;
                                        }
                                    },
                                    get initialSlide() {
                                        if(itemToShow == 5.5) {
                                            return this.initialSlide = 0.5;
                                        } else {
                                            return this.initialSlide = 0;
                                        }
                                    }
                                }
                            },
                            {
                                breakpoint: 1024,
                                settings: {
                                    arrows: itemArrows,
                                    dots: itemDots,
                                    autoplay: false,
                                    get slidesToShow() {
                                        if(itemToShow !== undefined && itemToShow !== null && itemToShow !== ''){
                                            if(itemToShow == 5 || itemToShow == 6){
                                                return this.slidesToShow = itemToShow - 1;
                                            } else {
                                                if (productGrid.parents('.collection-column-2').length){
                                                    return this.slidesToShow = 2;
                                                } else{
                                                    return this.slidesToShow = itemToShow;
                                                }
                                               
                                            }
                                        } else {
                                            return this.slidesToShow = 1;
                                        }
                                    },
                                    get slidesToScroll() {
                                        if(itemToShow !== undefined && itemToShow !== null && itemToShow !== '' && itemToShow !== 2.5 && itemToShow !== 3.5 && itemToShow !== 4.5 && itemToShow !== 5.5){
                                            if(itemToShow == 5 || itemToShow == 6){
                                                return this.slidesToScroll = itemToShow - 1;
                                            } else {
                                                if (productGrid.parents('.collection-column-2').length){
                                                    return this.slidesToScroll = 2;
                                                } else{
                                                    return this.slidesToScroll = itemToShow;
                                                }
                                               
                                            }
                                        } else {
                                            return this.slidesToScroll = 1;
                                        }
                                    },
                                    get initialSlide() {
                                        if(itemToShow == 5.5) {
                                            return this.initialSlide = 0.5;
                                        } else {
                                            return this.initialSlide = 0;
                                        }
                                    }
                                }
                            },
                            {
                                breakpoint: 991,
                                settings: {
                                    arrows: itemArrowsMb,
                                    dots: itemDotsMb,
                                    autoplay: false,
                                    get slidesToShow(){
                                        if (productGrid.hasClass('has__banner_tab') || productGrid.parents('.product-block-has__banner').length){
                                            if (productGrid.parents('.product-block-has__banner').length && productGrid.parents('.product-block-has__banner').data('width-banner') > 40) {
                                                return this.slidesToShow = 2;
                                            }
                                            else {
                                                if(itemToShow == 2.5) {
                                                    return this.slidesToShow = 2;
                                                } else {
                                                    return this.slidesToShow = 3;
                                                }
                                            }
                                        }
                                        else{
                                            if (productGrid.parents('.collection-column-2').length){
                                                return this.slidesToShow = 2;
                                            }
                                            else if (itemToShow == 1) {
                                                return this.slidesToShow = itemToShow;
                                            }
                                            else{
                                                if(itemToShow == 3.5 || itemToShow == 4.5) {
                                                    return this.slidesToShow = 3;
                                                } else {
                                                    return this.slidesToShow = 4;
                                                }
                                            }
                                        }
                                    },
                                    get slidesToScroll(){
                                        if (productGrid.hasClass('has__banner_tab') || productGrid.parents('.product-block-has__banner').length){
                                            if (productGrid.parents('.product-block-has__banner').length && productGrid.parents('.product-block-has__banner').data('width-banner') > 40) {
                                                return this.slidesToScroll = 2;
                                            }
                                            else {
                                                if(itemToShow == 2.5) {
                                                    return this.slidesToScroll = 2;
                                                } else {
                                                    return this.slidesToScroll = 3;
                                                }
                                            }
                                        }
                                        else{
                                            if (productGrid.parents('.collection-column-2').length){
                                                return this.slidesToScroll = 2;
                                            }
                                            else if (itemToShow == 1) {
                                                return this.slidesToScroll = itemToShow;
                                            }
                                            else{
                                                if(itemToShow == 3.5 || itemToShow == 4.5) {
                                                    return this.slidesToScroll = 3;
                                                } else {
                                                    return this.slidesToScroll = 4;
                                                }
                                            }
                                        }
                                    },
                                    get initialSlide() {
                                        if(itemToShow == 5.5) {
                                            return this.initialSlide = 0.5;
                                        } else {
                                            return this.initialSlide = 0;
                                        }
                                    }
                                }
                            },
                            {
                                breakpoint: 767,
                                arrows: itemArrowsMb,
                                dots: itemDotsMb,
                                autoplay: false,
                                settings: {
                                    get slidesToShow(){
                                        if (productGrid.hasClass('has__banner_tab') || productGrid.parents('.product-block-has__banner').length){
                                            return this.slidesToShow = 2;
                                        }
                                        else if (itemToShow == 1) {
                                            return this.slidesToShow = itemToShow;
                                        }
                                        else{
                                            if(itemToShow == 3.5 || itemToShow == 4.5) {
                                                return this.slidesToShow = 2;
                                            } else {
                                                return this.slidesToShow = 3;
                                            }
                                        }
                                    },
                                    get slidesToScroll(){
                                        if (productGrid.hasClass('has__banner_tab') || productGrid.parents('.product-block-has__banner').length){
                                            return this.slidesToScroll = 2;
                                        }
                                        else if (itemToShow == 1) {
                                            return this.slidesToScroll = itemToShow;
                                        }
                                        else{
                                            if(itemToShow == 3.5 || itemToShow == 4.5) {
                                                return this.slidesToScroll = 2;
                                            } else {
                                                return this.slidesToScroll = 3;
                                            }
                                        }
                                    },
                                    get initialSlide() {
                                        if(itemToShow == 5.5) {
                                            return this.initialSlide = 0.5;
                                        } else {
                                            return this.initialSlide = 0;
                                        }
                                    }
                                }
                            },
                            {
                                breakpoint: 320,
                                arrows: itemArrowsMb,
                                dots: itemDotsMb,
                                autoplay: itemAutoplay,
                                settings: {
                                    get slidesToShow(){
                                        if (itemToShow == 1) {
                                            if (productGrid.hasClass('special-banner__products--slider') || productGrid.hasClass('special-banner__products--grid')) {
                                                return this.slidesToShow = 2;
                                            } else {
                                                return this.slidesToShow = itemToShow;
                                            }
                                        }
                                        else {
                                            if(itemToShow == 2.5 || itemToShow == 3.5 || itemToShow == 4.5) {
                                                return this.slidesToShow = 1;
                                            } else {
                                                return this.slidesToShow = 2;
                                            }
                                        }

                                    },
                                    get slidesToScroll(){
                                        if (itemToShow == 1) {
                                            return this.slidesToScroll = itemToShow;
                                        }
                                        else {
                                            if(itemToShow == 2.5 || itemToShow == 3.5 || itemToShow == 4.5) {
                                                return this.slidesToScroll = 1;
                                            } else {
                                                return this.slidesToScroll = 2;
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    });

                    if (productGrid.hasClass('enable_progress_bar')) {
                        productGrid.on('afterChange', (event, slick, nextSlide) => {
                            var percent = ((nextSlide / (slick.slideCount - itemToShow)) * 100) + '%';
                            progressBar.css('--percent', percent);
                        });
                    }
                    if (productGrid.hasClass('enable_counter_number')) {
                        var slickNext = productGrid.find('.slick-next');
                        productGrid.closest('.halo-block, .special-banner__product, .cust-prod-widget__product').find('.products-counter-number').appendTo(slickNext);
                        productGrid.on('afterChange', (event) => {
                            var slickIndex = productGrid.find('.slick-current').data('slick-index');
                            var displayCount = slickIndex + itemToShow;
                            var totalItems = wrapper.data('limit');

                            if (displayCount > totalItems) {
                                displayCount = totalItems;
                            }
                            productGrid.find("#count-image").text(displayCount);
                        });
                    }

                    if ($('body').hasClass('cursor-fixed__show')){
                        window.sharedFunctionsAnimation.onEnterButton();
                        window.sharedFunctionsAnimation.onLeaveButton();
                    }
                }
            }

            if (swatchLabel.length) {
                function getMaxHeight() {
                    var maxHeight = 0;

                    productGrid.find('.slick-slide').each(function () {
                        var slideHeight = $(this).outerHeight();
                        if (slideHeight > maxHeight) {
                            maxHeight = slideHeight;
                        }
                    });
                    return maxHeight;
                }

                productGrid.on('click', '.swatch .swatch-label', function () {
                    setTimeout(() => {
                        var maxHeight = getMaxHeight();
                        productGrid.find(".slick-list").css({ height: maxHeight + 'px', transition: "500ms ease", })
                    }, 50);
                });
            }
        },

        productBlockInfiniteScroll: function() {
            var productBlock = $('[data-product-block], [data-product-tab-block]');

            productBlock.each((index, element) => {
                var $block = $(element),
                    showMore = $block.find('[data-product-infinite]');
            
                if (showMore.length > 0) {
                    showMore.find('.button').on('click', (event) => {
                        var showMoreButton = $(event.target);

                        if (!showMoreButton.hasClass('view-all')) {
                            event.preventDefault();
                            event.stopPropagation();

                            // var text = window.button_load_more.loading;

                            showMoreButton.addClass('is-loading');
                            // showMoreButton.text(text);

                            var url = showMoreButton.attr('data-collection'),
                                limit = showMoreButton.attr('data-limit'),
                                swipe = showMoreButton.attr('data-swipe'),
                                total = showMoreButton.attr('data-total'),
                                image_ratio = showMoreButton.attr('data-image-ratio'),
                                sectionId = showMoreButton.attr('sectionId'),
                                page = parseInt(showMoreButton.attr('data-page'));

                            halo.doProductBlockInfiniteScroll(url, total, limit, swipe, image_ratio, sectionId, page, showMoreButton, $block);
                        } else {
                            window.location = showMoreButton.data('href');
                        }
                    });
                }
            });
        },

        doProductBlockInfiniteScroll: function(url, total, limit, swipe, image_ratio, sectionId, page, showMoreButton, $block){
            $.ajax({
                type: 'get',
                url: window.routes.root + '/collections/' + url,
                cache: false,
                data: {
                    view: 'ajax_product_block',
                    constraint: 'limit=' + limit + '+page=' + page + '+sectionId=' + sectionId + '+imageRatio=' + image_ratio + '+swipe=' + swipe
                },
                beforeSend: function () {
                    // halo.showLoading();
                },
                success: function (data) {
                    const $productGrid = showMoreButton.closest('.tab-content').length ? showMoreButton.closest('.tab-content').find('.products-grid') : showMoreButton.closest('.halo-block-content').find('.products-grid');
                    let length = $productGrid.find('.product').length;
                    const res = halo.handleResponse($(data), length, $productGrid.data('products-to-show'));
                    $productGrid.append(res);

                    if(length + res.length < $(data).length) {
                        var text = window.button_load_more.default;

                        showMoreButton.removeClass('is-loading');
                        showMoreButton.attr('data-page', page + 1);
                        showMoreButton.find('span').text(text);
                    } else {
                        if (Number(total) > $(data).length && $(data).length <= length + res.length) {
                            var text = window.button_load_more.view_all;

                            showMoreButton.find('span').text(text);
                            showMoreButton.removeClass('is-loading');
                            showMoreButton.attr('data-href', window.routes.root + '/collections/' + url).addClass('view-all');
                        } else {
                            var text = window.button_load_more.no_more;

                            showMoreButton.find('span').text(text);
                            showMoreButton.removeClass('is-loading');
                            showMoreButton.attr('disabled', 'disabled');
                        }
                    }
                },
                complete: function () {
                    // halo.hideLoading();
                    if (halo.checkNeedToConvertCurrency()) {
                        Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                    };
                }
            });
        },

        doBeforeMegaMenuProductBlock: function () {
            var menuItemMega = $('.menu-lv-item.has-megamenu');

            if (menuItemMega.length > 0 && window.innerWidth > 1025) {
                menuItemMega.mouseenter(function () {
                    var block = $(this).find('.menu-dropdown__block--content .products-carousel');
                    var handle = block.data('product');
                    var url = block.data('collection');
                    var url_handle;

                    if (block.hasClass('megamenu_1')) {
                        if (handle) {
                            url_handle = window.routes.root + '/products/' + handle;
                        }
                    } else if (block.hasClass('megamenu_5')) {
                        if (url) {
                            url_handle = window.routes.root + '/collections/' + url;
                        }
                    }

                    if (url_handle) {
                        halo.renderMegaMenuProductBlock(block, url_handle);
                    }
                });
            }
        },


        renderMegaMenuProductBlock: function(wrapper, url_handle) {
            var block = wrapper;

            if (block.hasClass('ajax-loaded')) return;

            var limit = block.data('row'),
                sectionId = 'list-result-block';

            $.ajax({
                type: 'GET',
                url: url_handle,
                cache: false,
                data: {
                    view: 'ajax_product_card_mega_menu',
                    constraint: `limit=${limit}+sectionId=${sectionId}`
                },
                beforeSend: () => {
                    block.addClass('ajax-loaded');
                },
                success: (data) => {
                    if (block.hasClass('megamenu_1')) {
                        block.html(data);
                    } else if (block.hasClass('megamenu_5')) {
                        const dataRes = halo.handleResponse($(data), 0, limit);
                        block.html(dataRes);
                        halo.productMenuSlider(block);
                    }

                    if (halo.checkNeedToConvertCurrency()) {
                        Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                    }
                },
                complete: () => {
                    if (halo.checkNeedToConvertCurrency()) {
                        Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                    }
                }
            });
        },

        productMenuSlider: function(wrapper){
            var productGrid = wrapper,
                _dataRows = productGrid.data('row');
            if(productGrid.length > 0) {
                if(productGrid.not('.slick-initialized')) {
                    productGrid.slick({
                        mobileFirst: true,
                        adaptiveHeight: true,
                        vertical: false,
                        infinite: false,
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        arrows: false,
                        dots: true,
                        rtl: window.rtl_slick,
                        responsive: 
                        [
                            {
                                breakpoint: 1024,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 1,
                                }
                            },
                            {
                                breakpoint: 1500,
                                settings: {
                                    slidesToShow: _dataRows,
                                    slidesToScroll: 1,
                                    dots: false
                                }
                            }
                        ]
                    });
                }
            }
        },

        buildRecommendationBlock: function(){
            if (document.querySelector('[data-recommendations-block]') == null) return;

            var $this = document.querySelector('[data-recommendations-block]'),
                layout = $this.dataset.layout;
                swipe = $this.dataset.swipe;

            const config = {
                threshold: 0,
            }

            const handleIntersection = (entries, observer) => {
                const recommendationsContainer = $this.querySelector('.wrapper-container');
                if (!entries[0].isIntersecting) return;
                if ($this.innerHTML.trim() != '' && !recommendationsContainer.classList.contains('product-recommendations-loading') && !recommendationsContainer.classList.contains('has-product')) return;
                recommendationsContainer.classList.add('has-product');

                fetch($this.dataset.url)
                .then(response => response.text())
                .then(text => {
                    const html = document.createElement('div');
                    html.innerHTML = text;
                    const recommendations = html.querySelector('[data-recommendations-block]');
                    if (recommendations && recommendations.innerHTML.trim().length) {
                        $this.innerHTML = recommendations.innerHTML;

                        var productItems = $($this).find('.product-item')
                        var firstProductData = productItems.eq(0).data('json-product')
                        if (!firstProductData) return $($this).remove();

                        if (layout == 'slider') {
                            halo.productBlockSilder($($this));
                        }

                        var productItems = $($this).find('.product-item')
                        productItems.each(async (index, rawProduct) => {
                            var product = $(rawProduct);
                            var productId = product.data('product-id');
                            var productJson = product.data('json-product');
                            var handle = productJson.handle
                            
                            await  $.ajax({
                                type: 'get',
                                url: window.routes.root + '/products/' + handle + '?view=ajax_variant_quantity',
                                beforeSend: function () {},
                                success: function (data) {
                                    const element = new DOMParser().parseFromString(data, 'text/html')
                                    if (element.querySelector(`[data-quantity-product-id="${productId}"]`)) {
                                        const quantityInfo = JSON.parse(element.querySelector(`[data-quantity-product-id="${productId}"]`).innerHTML)
                                        window[`quick_view_inven_array_${productId}`] = quantityInfo
                                    }
                                },      
                                error: function (xhr, text) {
                                    halo.showWarning($.parseJSON(xhr.responseText).description);
                                },
                                complete: function () {}
                            });
                        }) 

                        const loadingImages = $this.querySelectorAll('.media--loading-effect img');
                        this.observeImageLazyloaded(loadingImages);

                        if(window.compare.show){
                            var $compareLink = $('[data-compare-link]');

                            halo.setLocalStorageProductForCompare($compareLink);
                        }

                        if(window.wishlist.show){
                            halo.setLocalStorageProductForWishlist();
                        }

                        if ($('body').hasClass('cursor-fixed__show')){
                            window.sharedFunctionsAnimation.onEnterButton();
                            window.sharedFunctionsAnimation.onLeaveButton();
                        }

                        if($body.hasClass('product-card-layout-08')) {
                            halo.productCountdownCard();
                        }

                        this.calculateTranslateYHeight()
                    }
                })
                .catch(e => {
                    console.error(e);
                });
            }

            new IntersectionObserver(handleIntersection.bind($this), ({}, config)).observe($this);
        },

        initVideoPopup: function (){
            if ($(".video-open-popup").length) {
            } else {return}
            $('.video-open-popup .video-button').off('click').on('click',function(){
                let video_type = $(this).attr('data-type'),
                    video_src = $(this).attr('data-src'),
                    aspect_ratio = $(this).attr('aspect_ratio'),
                    modal = $('[data-popup-video]');

                const $content = `<div class="fluid-width-video-wrapper" style="padding-top: ${aspect_ratio}">
                                    ${video_type == 'youtube' ? 
                                        `<iframe
                                            id="player"
                                            type="text/html"
                                            width="100%"
                                            frameborder="0"
                                            webkitAllowFullScreen
                                            mozallowfullscreen
                                            allowFullScreen
                                            src="https://www.youtube.com/embed/${video_src}?autoplay=1&mute=1">
                                        </iframe>`
                                        :
                                        `<iframe 
                                            src="https://player.vimeo.com/video/${video_src}?autoplay=1&mute=1" 
                                            class="js-vimeo" 
                                            allow="autoplay; 
                                            encrypted-media" 
                                            webkitallowfullscreen 
                                            mozallowfullscreen 
                                            allowfullscreen">
                                        </iframe>`
                                    }
                                </div>`;
                modal.find('.halo-popup-content').html($content);
                $body.addClass('video-show');
            });

            $('[data-popup-video], [data-popup-video] .halo-popup-close, .background-overlay').on('click', function (e) {
                // e.preventDefault();
                // e.stopPropagation();
                let modalContent = $('[data-popup-video] .halo-popup-content');
                if (!modalContent.is(e.target) && !modalContent.has(e.target).length) {
                    $body.removeClass('video-show');
                    $('[data-popup-video] iframe').remove();
                };
            });
        },

        swapHoverVideoProductCard: function () {
            if (window.innerWidth > 1200) {
                $('.product-item .card:not(.has-first-video)').mouseenter(function () {
                    var chil = $(this).find('video');
                    var _chil = $(this).find('video').get(0);
                    if (chil.length > 0) {
                        _chil.play();
                    }
                });
                $('.product-item .card:not(.has-first-video)').mouseleave(function () {
                    var chil = $(this).find('video');
                    var _chil = $(this).find('video').get(0);
                    if (chil.length > 0) {
                        _chil.pause();
                    }
                })
            }

            $.fn.isInViewport = function () {
                let elementTop = $(this).offset().top,
                    elementBottom = elementTop + $(this).outerHeight(),

                    viewportTop = $(window).scrollTop(),
                    viewportBottom = viewportTop + $(window).height();

                return elementBottom > viewportTop && elementTop < viewportBottom;
            };

            $(".product-item .card.has-first-video").each(function () {
                let chil = $(this).find('video');
                let firstImg = $(this).find("img:first-child");
                let _chil = $(this).find('video').get(0);

                const playVideoCard = () => {
                    if (firstImg.length > 0) firstImg.css("opacity", "0");

                    if (chil.length > 0) {
                        chil.css("opacity", "1")
                        _chil.play()
                    };
                }

                const pauseVideoCard = () => {
                    if (chil.length > 0) _chil.pause();
                }

                if ($(this).isInViewport()) {
                    playVideoCard()
                } else {
                    pauseVideoCard()
                }

                window.addEventListener('scroll', () => {
                    if ($(this).isInViewport()) {
                        playVideoCard()
                    } else {
                        pauseVideoCard()
                    }
                });
            });
        },

        initGlobalCheckbox: function() {
            $doc.on('change', '.global-checkbox--input', (event) => {
                var targetId = event.target.getAttribute('data-target');

                if(event.target.checked){
                    $(targetId).attr('disabled', false);
                } else{
                    $(targetId).attr('disabled', true);
                }
            });

            $doc.on('click', '[data-term-condition]', (event) => {
                event.preventDefault();
                event.stopPropagation();
                $body.addClass('term-condition-show');
            });

            $doc.on('click', '[data-close-term-condition-popup]', (event) => {
                event.preventDefault();
                event.stopPropagation();
                $body.removeClass('term-condition-show');
            });

            $doc.on('click', (event) => {
                setTimeout(() => {
                    if ($body.hasClass('cart-sidebar-show')) {
                        if (($(event.target).closest('[data-term-condition-popup]').length === 0)){
                            $body.removeClass('term-condition-show');
                        }
                    }
                    if ($body.hasClass('term-condition-show')) {
                        if ($(event.target).closest('[data-term-condition-popup]').length === 0){
                            $body.removeClass('term-condition-show');
                        }
                    }
                }, 10);
            });
        },
        
        initColorSwatch: function() {
            $doc.ready(function() {
                $('.card .swatch-label.is-active').trigger('click');
            });
            
            $doc.on('click', '.card .swatch-label', (event) => {
                var $target = $(event.currentTarget),
                    title = $target.attr('title').replace(/^\s+|\s+$/g, ''),
                    product = $target.closest('.product-item'),
                    productJson = product.data('json-product'),
                    productTitle = product.find('.card-title'),
                    productAction = product.find('[data-btn-addtocart]'),
                    productAction2 = product.find('.card-product [data-btn-addtocart]'),
                    variantId = $target.data('variant-id'),
                    productHref = product.find('a').attr('href'),
                    oneOption = $target.data('with-one-option'),
                    newImage = $target.data('variant-img'),
                    mediaList = [];



                const $iconAddtocart = '<svg class="icon icon-cart" viewBox="0 0 286.74 356.73">\
                  <g data-name="Layer 1">\
                    <path d="m286.33,277.03l-.17-3.91c-.81-18.73-1.83-37.7-2.83-56.05l-.79-14.51c-.43-8.13-.9-16.26-1.37-24.4l-.24-4.18c-.84-14.79-1.71-30.08-2.35-45.1-.93-21.43-14.62-35.84-34.07-35.86h-20.65c-.42-20.33-5.78-38.81-15.94-54.94C189.14,8.27,157.22-5.8,126.6,2.23c-27.48,7.21-46.98,26.7-57.96,57.94-3.5,9.98-5.33,20.76-5.56,32.86h-9.52c-4.59,0-9.05-.01-12.39,0-16.64.12-30.01,12.35-31.79,29.06-1.42,13.39-2.1,27.29-2.7,39.55-.24,4.97-.5,9.95-.77,14.91-1.22,21.28-2.24,39.94-3.13,57.07-.29,5.45-.6,10.9-.92,16.36l-.02.3c-.82,13.9-1.67,28.28-1.82,42.5-.18,16.51,5.81,32.31,16.86,44.5,11.15,12.29,26.39,19.35,41.81,19.37,22.45.05,49.37.08,82.32.08s60.43-.02,87.24-.08c28.28-.04,53.63-23.49,57.72-53.39,1.19-8.74.78-17.61.37-26.23ZM63.13,130.98c.09,7.97,4.99,13.59,11.92,13.67h.12c6.97,0,11.9-5.57,11.99-13.53.04-3.2.04-6.33.04-9.63v-2.53s112.59,0,112.59,0v10.76c0,4.95,1.26,8.81,3.76,11.51,2.07,2.2,4.95,3.4,8.33,3.45h.11c5.72-.08,11.83-4.11,11.85-15.16v-10.77c.83-.01,1.68-.03,2.55-.04h.62c7.1-.1,15.15-.2,20.48.19,3.7.28,6.59,4.2,6.87,9.32.68,12.51,1.41,26.28,2.28,43.33l.1,2.01c.67,12.86,1.34,25.72,2.04,38.59.31,5.58.6,11.17.87,16.76.91,17.56,1.84,35.72,3.19,53.79,1.49,20.32-4.18,34.05-17.84,43.2-5.16,3.45-10.88,5.2-17.01,5.2h-15.06c-45.58.05-104.28.1-154.01-.02-9.16-.02-18.22-4.27-24.85-11.68-6.63-7.39-10.18-16.92-10-26.83.28-14.29,1.14-29.09,1.9-42.15.31-5.37.62-10.74.91-16.1.54-10.41,1.12-20.81,1.69-31.22l.07-1.28c.21-3.92.43-7.85.65-11.77.22-3.94.44-7.88.65-11.82.15-2.9.3-5.8.45-8.7.15-2.9.3-5.79.45-8.7.51-10.04,1.11-21.71,1.81-33.09.33-5.43,3.75-8.98,8.7-9.05,2.69-.04,6.15-.06,10-.06h11.79v3.83c0,1.68-.01,3.34,0,5h-.06l.04,3.54Zm24.05-38.1c.01-6.61,1.06-13.49,3.19-20.92,4.62-16.13,13.13-28.65,25.29-37.21,18.23-12.86,40.54-12.15,58.21,1.84,15.57,12.32,25.91,35.07,25.84,56.29h-112.53Z"></path>\
                  </g>\
                </svg>';

                $target.parents('.swatch').find('.swatch-label').removeClass('is-active');
                $target.addClass('is-active');
                
                if(productTitle.hasClass('card-title-change')){
                    if($body.hasClass('style_2_text_color_varriant')){
                        productTitle.find('[data-change-title]').text(title);
                    }else{
                        productTitle.find('[data-change-title]').text(' - ' + title);
                    }
                } else {
                    if($body.hasClass('style_2_text_color_varriant')){
                        productTitle.addClass('card-title-change').append('<span data-change-title>' + title + '</span>');
                    }else{
                        productTitle.addClass('card-title-change').append('<span data-change-title> - ' + title + '</span>');
                    }
                }

                const selectedVariant = productJson.variants.find(variant => variant.id === variantId)

                if (selectedVariant.compare_at_price > selectedVariant.price) {
                    product.find('.price').addClass('price--on-sale');
                    product.find('.price__sale .price-item--regular').html(Shopify.formatMoney(selectedVariant.compare_at_price, window.money_format));
                    product.find('.price__sale .price-item--sale').html(Shopify.formatMoney(selectedVariant.price, window.money_format));
                    const labelSale = `(-${Math.round((selectedVariant.compare_at_price - selectedVariant.price) * 100 / selectedVariant.compare_at_price)}%)`;
                    product.find('.price__label_sale .label_sale').html(labelSale);
                } else {
                    product.find('.price__regular .price-item').html(Shopify.formatMoney(selectedVariant.price, window.money_format));

                    if (selectedVariant.compare_at_price == null) {
                        product.find('.price').removeClass('price--on-sale');
                        product.find('.price__sale .price-item--regular').html('');
                    }
                }
  
                product.find('a:not(.single-action):not(.number-showmore):not(.vendor-text)').attr('href', productHref.split('?variant=')[0]+'?variant='+ variantId);

                if (oneOption != undefined) {
                    var quantity = $target.data('quantity');

                    product.find('[name="id"]').val(oneOption);
  
                    if (quantity > 0) {
                        if(window.notify_me.show){
                            productAction
                                .removeClass('is-notify-me')
                                .addClass('is-visible');
                        } else {
                            productAction
                                .removeClass('is-soldout')
                                .addClass('is-visible');
                        }
                    } else {
                       if(window.notify_me.show){
                            productAction
                                .removeClass('is-visible')
                                .addClass('is-notify-me');
                        } else {
                            productAction
                                .removeClass('is-visible')
                                .addClass('is-soldout');
                        }
                    }

                    if(productAction.hasClass('is-soldout') || productAction.hasClass('is-notify-me')){
                        if(productAction.hasClass('is-notify-me')){
                            if ($body.hasClass('product-card-layout-08')) {
                                productAction2
                                    .html($iconAddtocart)
                                    .prop('disabled', false);
                            } else {
                                productAction.text(window.notify_me.button);
                            }
                        } else {
                            if ($body.hasClass('product-card-layout-08')) {
                                productAction2
                                    .html($iconAddtocart)
                                    .prop('disabled', true);
                            } else {
                                productAction
                                    .text(window.variantStrings.soldOut)
                                    .prop('disabled', true);
                            }
                        }
                    } else {
                        if ($body.hasClass('product-card-layout-08')) {
                            productAction2
                                .html($iconAddtocart)
                                .prop('disabled', false);
                        } else {
                            productAction
                                .text(window.variantStrings.addToCart)
                                .prop('disabled', false);
                        }
                    }
                } else {
                    if (productJson != undefined) {
                        if(window.quick_shop.show){
                            halo.checkStatusSwatchQuickShop(product, productJson);
                        }
                    }

                    product.find('.swatch-element[data-value="' + title + '"]').find('.single-label').trigger('click');
                }

                if (productJson.media != undefined) {
                    var mediaList = productJson.media.filter((index, element) => {
                        return element.alt === title;
                    });
                }

                if (mediaList.length > 0) {
                    if (mediaList.length > 1) {
                        var length = 2;
                    } else {
                        var length = mediaList.length;
                    }
                    
                    for (var i = 0; i < length; i++) {
                        product.find('.card-media img:eq('+ i +')').attr('srcset', mediaList[i].src);
                    }
                } else {
                    if (newImage) {
                        product.find('.card-media img:nth-child(1)')
                        .attr('srcset', newImage)
                        .attr('data-srcset', newImage);
                    }
                }
  
                // halo.checkPreOrderOfVariant(selectedVariant, productAction, productJson)
                if (halo.checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                }
            });
              
            $doc.on('click', '.item-swatch-more .number-showmore', (event) => {
                if ($(event.target).closest('.swatch').hasClass('show--more')) {
                    $(event.target).closest('.swatch').removeClass('show--more');
                    $(event.target).find('span:eq(0)').text('+');
                } else {
                    $(event.target).closest('.swatch').addClass('show--more');
                    $(event.target).find('span:eq(0)').text('-'); 
                }
            })
        },

        checkPreOrderOfVariant: function(selectedVariant, productAction, productJson) {
            // Check if variant is allowed to sale when out of stock
            const variantId = selectedVariant.id
            const updatePreOrderText = (productAction, selectedVariant, inventoryQuantity) => {
                const product = productAction.parents('.product-item');
                const hasQuickShopPanel = product.find('[data-quickshop-popup]').length > 0;

                if (selectedVariant.inventory_management == null) {
                    productAction
                        .text(hasQuickShopPanel ? window.variantStrings.add : window.variantStrings.addToCart)
                        .prop('disabled', false)
                        .removeClass('is-notify-me')
                        .addClass('button--pre-untrack')
                }
                else if (selectedVariant.available && inventoryQuantity <=0 ) {
                    productAction
                        .text(window.variantStrings.preOrder)
                        .prop('disabled', false)
                        .removeClass('is-notify-me')
                        .addClass('button--pre-untrack')
                } else {
                    productAction.removeClass('button--pre-untrack');
                    if (inventoryQuantity > 0) {
                        if(window.notify_me.show){
                            productAction
                                .removeClass('is-notify-me')
                                .addClass('is-visible')
                        } else {
                            productAction
                                .removeClass('is-soldout')
                                .addClass('is-visible')
                        }
                    } else {
                      
                       if(window.notify_me.show){
                            productAction
                                .removeClass('is-visible')
                                .addClass('is-notify-me')
                                .prop('disabled', false);
                        } else {
                            productAction
                                .removeClass('is-visible')
                                .addClass('is-soldout').prop('disabled', true);
                        }
                    }

                    if(productAction.hasClass('is-soldout') || productAction.hasClass('is-notify-me')){
                        if(productAction.hasClass('is-notify-me')){

                            productAction.text(window.notify_me.button).prop('disabled', false).removeClass('btn-unavailable');;
                        } else {
                            productAction
                                .text(window.variantStrings.soldOut)
                                .prop('disabled', true);
                        }
                    } else {
                        productAction
                            .text(hasQuickShopPanel ? window.variantStrings.add : window.variantStrings.addToCart)
                            .prop('disabled', false);
                    }
                }
            }
    
            const variantsQuantityInvenText = `quick_view_inven_array_${productJson.id}`
            var arrayInVarName = variantsQuantityInvenText,
                inven_array = window[arrayInVarName]; 
            
            if(inven_array != undefined) {
                var inven_num = inven_array[variantId],
                    inventoryQuantity = parseInt(inven_num);
                    updatePreOrderText(productAction, selectedVariant, inventoryQuantity)
            } else {
                $.ajax({
                    type: 'get',
                    url: window.routes.root + '/products/' + productJson.handle + '?view=ajax_quick_shop_data',
                    beforeSend: function () {},
                    success: function (data) {
                        window[variantsQuantityInvenText] = JSON.parse(data.split('=')[1])
                        var inven_num = window[variantsQuantityInvenText][variantId],
                            inventoryQuantity = parseInt(inven_num);
                        updatePreOrderText(productAction, selectedVariant, inventoryQuantity)   
                    },      
                    error: function (xhr, text) {
                        halo.showWarning($.parseJSON(xhr.responseText).description);
                    },
                    complete: function () {
                        
                    }
                });
            }
        },

        initQuickShop: function() {
            if(window.quick_shop.show) {
                $doc.on('click', '[data-quickshop-popup]', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    
                    var $target = $(event.target),
                        product = $target.parents('.product-item'),
                        productJson = product.data('json-product'),
                        variantPopup = product.find('.variants-popup');
                        
                    const $quickView = document.querySelector('.halo-quick-view-popup');
                    if (!document.body.matches('.qv-loaded', '.qs3-loaded') && $quickView) {
                        halo.buildStyleSheet($quickView.dataset.urlStyleProduct, $quickView);
                        document.body.classList.add('qs3-loaded');
                    }

                    if ($body.hasClass('quick_shop_option_1')) {
                        if (!$('.productListing').hasClass('productList')) {
                            halo.appendProductQuickShopOption2(product);
                        }
                    }

                    if(!product.hasClass('quickshop-popup-show')){
                        $('.product-item').removeClass('quickshop-popup-show');

                        if ($body.hasClass('quick_shop_option_2')) {
                            var height = product.find('.card-media').outerHeight(true);
                            var variantsArray = variantPopup.find('.variants')

                            if ($body.hasClass('product-card-layout-02')){
                                if ($win.width() > 1024) {
                                    variantsArray.css('max-height', (height - 114) + 'px');
                                    variantsArray.css('min-height', (height - 114) + 'px');
                                } else {
                                    variantsArray.css('max-height', (height - 70) + 'px');
                                    variantsArray.css('min-height', (height - 70) + 'px');
                                } 
                            } else if ($body.hasClass('product-card-layout-04')){
                                if ($win.width() > 1024) {
                                    variantsArray.css('max-height', (height - 116) + 'px');
                                    variantsArray.css('min-height', (height - 116) + 'px');
                                } else {
                                    variantsArray.css('max-height', (height - 70) + 'px');
                                    variantsArray.css('min-height', (height - 70) + 'px');
                                } 
                            } else {
                                if ($win.width() > 1024) {
                                    variantsArray.css('max-height', (height - 74) + 'px');
                                    variantsArray.css('min-height', (height - 74) + 'px');
                                } else {
                                    variantsArray.css('max-height', (height - 20) + 'px');
                                    variantsArray.css('min-height', (height - 20) + 'px');
                                } 
                            }

                            if (variantsArray[0].scrollHeight > variantsArray[0].clientHeight) {
                                variantsArray.addClass('scrollable')
                            }

                            if (!$('.productListing').hasClass('productList')){
                                halo.appendProductQuickShopOption2(product);
                            }
                        } else if ($body.hasClass('quick_shop_option_3')) {
                            const handle = $target.data('product-handle');
                            if (!$('.productListing').hasClass('productList')){
                                halo.updateContentQuickshopOption3(handle);
                            }
                            
                            $doc.on('click', '[data-close-quick-shop-popup]', (event) => {
                                event.preventDefault();
                                event.stopPropagation();
                
                                $body.removeClass('quickshop-popup-show');
                            });
                            
                            $doc.off('click.quickShopOverlay').on('click.quickShopOverlay', (event) => {
                                if ($body.hasClass('quickshop-popup-show')) {
                                    if (($(event.target).closest('[data-quickshop-popup-option-3]').length === 0)){
                                        $body.removeClass('quickshop-popup-show');
                                    }
                                }
                            })
                        } else if ($body.hasClass('quick_shop_bulk')) {
                            const handle = $target.data('product-handle');
                            if (!$('.productListing').hasClass('productList')){
                                halo.updateContentQuickBulk(handle, $target);
                            }
                            
                            $doc.on('click', '[data-close-quick-shop-popup]', (event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                $body.removeClass('quickshop-popup-show');
                            });
                            
                            $doc.off('click.quickShopOverlay').on('click.quickShopOverlay', (event) => {
                                if ($body.hasClass('quickshop-popup-show')) {
                                    if (($(event.target).closest('[data-halo-quick-bulk-popup]').length === 0)){
                                        $body.removeClass('quickshop-popup-show');
                                    }
                                }
                            })
                        }
                        
                        if (!$body.hasClass('quick_shop_bulk')) {
                            if (!$body.hasClass('quick_shop_option_3')) {
                                if ($win.width() < 767) {
                                    if ($('.productListing').hasClass('productList')) {
                                        halo.appendToListViewModal(product)
                                    } else {
                                        product.addClass('quickshop-popup-show');
                                    }
                                } else {
                                    product.addClass('quickshop-popup-show');
                                }
                            } else {
                                if ($('.productListing').hasClass('productList')){
                                    if ($win.width() < 767) {
                                        halo.appendToListViewModal(product)
                                    } else {
                                        product.addClass('quickshop-popup-show');
                                    }
                                }
                            }
                        }
                        
                        product.find('.swatch-label.is-active').trigger('click');
                        halo.checkStatusSwatchQuickShop(product, productJson);

                        let checkQuickShop1ForMobile = false;
                        if ($body.hasClass('quick_shop_option_1') && $win.width() < 767) checkQuickShop1ForMobile = true;
                        
                        if ($body.hasClass('quick_shop_option_2') || checkQuickShop1ForMobile || ($('productListing').hasClass('productList') && !$('.card-swatch').hasClass('quick_shop_type_3'))) {
                            if ($win.width() < 767) {
                                if (!$('.productListing').hasClass('productList')){
                                    var quickshopVariantPopup = $('#halo-card-mobile-popup .variants-popup');
                                    quickshopVariantPopup.find('.selector-wrapper').each((index, element) => {
                                        $(element).find('.swatch-element:not(.soldout):not(.unavailable)').eq('0').find('.single-label').trigger('click');
                                    });
                                } else {
                                    variantPopup.find('.selector-wrapper').each((index, element) => {
                                        $(element).find('.swatch-element:not(.soldout):not(.unavailable)').eq('0').find('.single-label').trigger('click');
                                    });
                                }
                            } else {
                                variantPopup.find('.selector-wrapper').each((index, element) => {
                                    $(element).find('.swatch-element:not(.soldout):not(.unavailable)').eq('0').find('.single-label').trigger('click');
                                });
                            }
                            if (!$('.productListing').hasClass('productList')){
                                $body.addClass('quick_shop_popup_mobile');
                            }
                        } else {
                            variantPopup.find('.selector-wrapper:not(.option-color)').each((index, element) => {
                                $(element).find('.swatch-element:not(.soldout):not(.unavailable)').eq('0').find('.single-label').trigger('click');
                            });
                        }
                    } else {
                        halo.initAddToCartQuickShop($target, variantPopup);
                    }

                    if (halo.checkNeedToConvertCurrency()) {
                        Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                    }
                });

                $doc.on('click', '[data-cancel-quickshop-popup]', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    var $target = $(event.currentTarget),
                        product = $target.parents('.product-item'),
                        quickshopMobilePopup = $doc.find('#halo-card-mobile-popup');

                    product.removeClass('quickshop-popup-show');
                    var productQuickshopShown = $doc.find('.quickshop-popup-show')
                    productQuickshopShown.removeClass('quickshop-popup-show');
                    $body.removeClass('quickshop-list-view-show');
                     
                    if ($body.hasClass('quick_shop_option_1') || $body.hasClass('quick_shop_option_2')) {
                        $body.removeClass('quick_shop_popup_mobile');
                        quickshopMobilePopup.removeClass('show');
                    }
                });

                $doc.on('click', (event) => {
                    if ($(event.target).closest('[data-quickshop-popup]').length === 0 && $(event.target).closest('.variants-popup').length === 0 && $(event.target).closest('.card-swatch').length === 0 && $(event.target).closest('[data-warning-popup]').length === 0) {
                        $('.product-item').removeClass('quickshop-popup-show');
                        if($body.hasClass('quick_shop_option_2')){
                            $body.removeClass('quick_shop_popup_mobile');
                        }
                    }
                });

                halo.changeSwatchQuickShop();
            }
        },
  
        appendToListViewModal: function(product)  {
            const quickshopMobilePopup = $doc.find('#list-view-popup');
            const quickshopForm = product.clone();
            quickshopMobilePopup.find('.halo-popup-content').empty();
            quickshopMobilePopup.find('.halo-popup-content').append(quickshopForm);

            const form = quickshopMobilePopup.find('[data-quickshop] .card-information .variants-popup form').eq('0');
            const mobilePopupId = form.attr('id') + '-mobile';
            const optionInputs = form.find('.single-option');
            const optionLabels = form.find('.single-label');
            const cardInfoWrapper = quickshopMobilePopup.find('.card-product')
            const variantsPopup = quickshopMobilePopup.find('.variants-popup')
            const submitBtn = quickshopMobilePopup.find('[data-btn-addtocart]')
            variantsPopup.removeClass("card-list__hidden")
            let clicked = {
                selected1: false,
                selected2: false,
                selected3: false
            } 

            form.attr('id', mobilePopupId);
            submitBtn.attr('data-form-id', submitBtn.attr('data-form-id') + '-mobile')

            optionInputs.each((index, optionInput) => {
                $(optionInput).attr('id', $(optionInput).attr('id') + '-mobile');
                $(optionInput).attr('name', $(optionInput).attr('name') + '-mobile');
                if (optionInput.checked) $(optionInput).trigger('change');
            })

            optionLabels.each((index, optionLabel) => {
                $(optionLabel).attr('for', $(optionLabel).attr('for') + '-mobile');

                const swatchWrapper = $(optionLabel).closest('.selector-wrapper')
                const swatchElement = $(optionLabel).closest('.swatch-element')
                if (!swatchElement.hasClass('available')) return 
                
                if (swatchWrapper.hasClass('selector-wrapper-1') && !clicked.selected1) {
                    clicked.selected1 = true
                    $(optionLabel).trigger('click')
                } else if (swatchWrapper.hasClass('selector-wrapper-2') && !clicked.selected2) {
                    clicked.selected2 = true 
                    $(optionLabel).trigger('click')
                } else if (swatchWrapper.hasClass('selector-wrapper-3') && !clicked.selected3) {
                    clicked.selected3 = true
                    $(optionLabel).trigger('click')
                }
            })

            $body.addClass('quickshop-list-view-show');

            $('.background-overlay').off('click.closeListViewModal').on('click.closeListViewModal', () => {
                $body.removeClass('quickshop-list-view-show');
            })
        },

        changeSwatchQuickShop: function () {
            $doc.on('change', '[data-quickshop] .single-option', (event) => {
                
                var $target = $(event.target),
                    product = $target.parents('.product-item'),
                    productJson = product.data('json-product'),
                    productAction = product.find('[data-btn-addtocart]'),
                    variantList,
                    optionColor = product.find('.option-color').data('option-position'),
                    optionIndex = $target.closest('[data-option-index]').data('option-index'),
                    swatch = product.find('.swatch-element'),
                    thisVal = $target.val(),
                    selectedVariant,
                    productInput = product.find('[name=id]');

                if ($('.productListing').hasClass('productList')) {
                    var selectedOption1 = product.find('.card-information .selector-wrapper-1').find('input:checked').val(),
                        selectedOption2 = product.find('.card-information .selector-wrapper-2').find('input:checked').val(),
                        selectedOption3 = product.find('.card-information .selector-wrapper-3').find('input:checked').val();
                }
                else {
                    var selectedOption1 = product.find('.selector-wrapper-1').find('input:checked').val(),
                        selectedOption2 = product.find('.selector-wrapper-2').find('input:checked').val(),
                        selectedOption3 = product.find('.selector-wrapper-3').find('input:checked').val();
                }

                if ($body.hasClass('quick_shop_option_2') && $('.productListing').hasClass('productList')) {
                    selectedOption1 = product.find('.selector-wrapper-1').eq('1').find('input:checked').val();
                } else {
                    if ($('.productListing').hasClass('productList') && $win.width() < 767) {
                        selectedOption1 = product.find('.selector-wrapper-1').eq('1').find('input:checked').val();
                        selectedOption2 = product.find('[data-option-index="1"]').eq('1').find('input:checked').val();
                    } else {
                        selectedOption1 = product.find('.selector-wrapper-1').eq('0').find('input:checked').val();
                    }
                }

                if (productJson != undefined) {
                    variantList = productJson.variants;
                }

                swatch.removeClass('soldout');
                swatch.find('input[type="radio"]').prop('disabled', false);

                switch (optionIndex) {
                    case 0:
                        var availableVariants = variantList.find((variant) => {
                            if (optionColor == 1) {
                                if (selectedOption3 != undefined) {
                                    return variant.option2 == thisVal && variant.option1 == selectedOption2 && variant.option3 == selectedOption3;
                                }
                                else {
                                    return variant.option2 == thisVal && variant.option1 == selectedOption2;
                                }
                            } else {
                                if (optionColor == 2) {
                                    return variant.option3 == thisVal && variant.option1 == selectedOption2;
                                } else {
                                    return variant.option1 == thisVal && variant.option2 == selectedOption2;
                                }
                            }
                        });

                        if(availableVariants != undefined){
                            selectedVariant =  availableVariants;
                        } else{
                            var altAvailableVariants = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == thisVal;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == thisVal;
                                    } else {
                                        return variant.option1 == thisVal;
                                    }
                                }
                            });

                            selectedVariant =  altAvailableVariants;
                        }

                        break;
                    case 1:
                        var availableVariants = variantList.find((variant) => {
                            if (optionColor == 1) {
                                return variant.option2 == selectedOption1 && variant.option1 == thisVal && variant.option3 == selectedOption2;
                            } else {
                                if (optionColor == 2) {
                                    return variant.option3 == selectedOption1 && variant.option1 == thisVal && variant.option2 == selectedOption2;
                                } else {
                                    return variant.option1 == selectedOption1 && variant.option2 == thisVal && variant.option3 == selectedOption2;
                                }
                            }
                        });

                        if(availableVariants != undefined){
                            selectedVariant =  availableVariants;
                        } else {
                            var altAvailableVariants = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == selectedOption1 && variant.option1 == thisVal;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == selectedOption1 && variant.option1 == thisVal;
                                    } else {
                                        return variant.option1 == selectedOption1 && variant.option2 == thisVal;
                                    }
                                }
                            });

                            selectedVariant =  altAvailableVariants;
                        }

                        break;
                    case 2:
                        var availableVariants = variantList.find((variant) => {
                            if (optionColor == 1) {
                                return variant.option2 == selectedOption1 && variant.option1 == selectedOption2 && variant.option3 == thisVal;
                            } else {
                                if (optionColor == 2) {
                                    return variant.option3 == selectedOption1 && variant.option1 == selectedOption2 && variant.option2 == thisVal;
                                } else {
                                    return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == thisVal;
                                }
                            }
                        });

                        if(availableVariants != undefined){
                            selectedVariant =  availableVariants;
                        }

                        break;
                }
                            
                if (selectedVariant == undefined) {
                    return;
                }
                
                productInput.val(selectedVariant.id);
                var value = $target.val();
               

                
                $target.parents('.selector-wrapper').find('.form-label span').text(value);
                if (selectedVariant.available) {
                    product.find('[data-btn-addtocart]').removeClass('btn-unavailable');
                    product.find('[data-quickshop] quickshop-update-quantity').removeClass('disabled');
                    product.find('[data-btn-addtocart]').attr('data-available', 'true')
                      
                } else {
                    product.find('[data-btn-addtocart]').addClass('btn-unavailable');
                    product.find('[data-quickshop] quickshop-update-quantity').addClass('disabled');
                    product.find('[data-btn-addtocart]').attr('data-available', 'false')
                }

                if (halo.checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                };

                if (!$body.hasClass('quick_shop_option_2') && !$body.hasClass('quick_shop_option_3') && $win.width() < 767) {
                    
                } 

                if ($body.hasClass('quick_shop_option_2') && $win.width() < 767) {
                    if ($('.halo-popup-wrapper .card-product__wrapper [data-option-index="0"] .swatch-element').length == 1){
                        $('.halo-popup-wrapper .card-product__wrapper [data-option-index="0"] .swatch-element').eq('0').find('.single-label').trigger('click');
                    }
                    if ($('.halo-product-list-view-popup .product-options-wrapper .product-item .card-information [data-option-index="0"] .swatch-element').length == 1) {
                        $('.halo-product-list-view-popup .product-options-wrapper .product-item .card-information [data-option-index="0"] .swatch-element').eq('0').find('.single-label').trigger('click');
                    }
                } 

                halo.checkStatusSwatchQuickShop(product, productJson);
                halo.checkPreOrderOfVariant(selectedVariant, productAction, productJson);
            });
        },

        checkStatusSwatchQuickShop: function(product, productJson){
            var variantPopup = product.find('.card-variant'),
                variantList,
                productOption = product.find('[data-option-index]'),
                optionColor = product.find('.option-color').data('option-position'),
                selectedOption1 = product.find('[data-option-index="0"]').find('input:checked').val(),
                selectedOption2 = product.find('[data-option-index="1"]').find('input:checked').val(),
                selectedOption3 = product.find('[data-option-index="2"]').find('input:checked').val(),
                productId = product.data('product-id');

            
            if ($body.hasClass('quick_shop_option_2')) {
                var height = product.find('.card-media').outerHeight(true);
                if (selectedOption3 != undefined) {
                    if ($body.hasClass('product-card-layout-01')) {
                        if (height < 310) {
                            $('[data-quickshop]').addClass('active_option_3');
                        } else {
                            $('[data-quickshop]').removeClass('active_option_3');
                        }  
                    } else {
                        if (height < 370) {
                            $('[data-quickshop]').addClass('active_option_3');
                        } else {
                            $('[data-quickshop]').removeClass('active_option_3');
                        } 
                    }
                } else {
                    if ($win.width() > 1024) {
                        if ($body.hasClass('product-card-layout-05')) {
                            if (height < 350 && selectedOption2 != undefined) {
                                $('[data-quickshop]').addClass('active_option_3');
                            } else {
                                $('[data-quickshop]').removeClass('active_option_3');
                            }    
                        } else if ($body.hasClass('product-card-layout-01')) {
                            if (height < 310 && selectedOption2 != undefined) {
                                $('[data-quickshop]').addClass('active_option_3');
                            } else {
                                $('[data-quickshop]').removeClass('active_option_3');
                            }  
                        }else {
                            if (height < 370 && selectedOption2 != undefined) {
                                $('[data-quickshop]').addClass('active_option_3');
                            } else {
                                $('[data-quickshop]').removeClass('active_option_3');
                            }   
                        }
                    } else {
                        if ($body.hasClass('product-card-layout-01')) {
                            if (height < 310) {
                                if (selectedOption1 != undefined || selectedOption2 != undefined) {
                                    $('[data-quickshop]').removeClass('active_option_3');
                                } else {
                                    $('[data-quickshop]').addClass('active_option_3');
                                }
                            } else {
                                $('[data-quickshop]').removeClass('active_option_3');
                            }   
                        } else {
                            if (height < 370) {
                                if (selectedOption1 != undefined || selectedOption2 != undefined) {
                                    $('[data-quickshop]').removeClass('active_option_3');
                                } else {
                                    $('[data-quickshop]').addClass('active_option_3');
                                }
                            } else {
                                $('[data-quickshop]').removeClass('active_option_3');
                            }   
                        }
                    }
                }
            }

            if ($body.hasClass('quick_shop_option_2') && $('.productListing').hasClass('productList')) {
                selectedOption1 = product.find('[data-option-index="0"]').eq('1').find('input:checked').val();
            } else {
                if ($('.productListing').hasClass('productList') && $win.width() < 767) {
                    selectedOption1 = product.find('[data-option-index="0"]').eq('1').find('input:checked').val();
                    selectedOption2 = product.find('[data-option-index="1"]').eq('1').find('input:checked').val();
                } else {
                    selectedOption1 = product.find('[data-option-index="0"]').eq('0').find('input:checked').val();
                }
            }
            
            if (productJson != undefined) {
                variantList = productJson.variants;
            }

            productOption.each((index, element) => {
                var optionIndex = $(element).data('option-index'),
                    swatch = $(element).find('.swatch-element');

                switch (optionIndex) {
                    case 0: 
                        swatch.each((idx, elt) => {
                            var item = $(elt),
                                swatchVal = item.data('value');

                            var optionSoldout = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == swatchVal && variant.available;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == swatchVal && variant.available;
                                    } else {
                                        return variant.option1 == swatchVal && variant.available;
                                    }
                                }
                            });

                            var optionUnavailable = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == swatchVal;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == swatchVal;
                                    } else {
                                        return variant.option1 == swatchVal;
                                    }
                                }
                            });

                            if(optionSoldout == undefined){
                                if (optionUnavailable == undefined) {
                                    item.removeClass('soldout available').addClass('unavailable');
                                    item.find('input[type="radio"]').prop('checked', false);
                                } else {
                                    item
                                        .removeClass('unavailable available')
                                        .addClass('soldout')
                                        .find('.single-action')
                                        .attr('data-variant-id', optionUnavailable.title);
                                    item.find('input[type="radio"]').prop('disabled', false);
                                }
                            } else {
                                item.removeClass('soldout unavailable').addClass('available');
                                item.find('input[type="radio"]').prop('disabled', false);
                            }
                        });

                        break;
                    case 1:
                        swatch.each((idx, elt) => {
                            var item = $(elt),
                                swatchVal = item.data('value');

                            var optionSoldout = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == selectedOption1 && variant.option1 == swatchVal && variant.available;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == selectedOption1 && variant.option1 == swatchVal && variant.available;
                                    } else {
                                        return variant.option1 == selectedOption1 && variant.option2 == swatchVal && variant.available;
                                    }
                                }
                            });

                            var optionUnavailable = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == selectedOption1 && variant.option1 == swatchVal;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == selectedOption1 && variant.option1 == swatchVal;
                                    } else {
                                        // CHECK: find the error and value of selectedOption1 
                                        return variant.option1 == selectedOption1 && variant.option2 == swatchVal;
                                    }
                                }
                            });

                            if(optionSoldout == undefined){
                                if (optionUnavailable == undefined) {
                                    item.removeClass('soldout available').addClass('unavailable');
                                    item.find('input[type="radio"]').prop('checked', false);
                                } else {
                                    item
                                        .removeClass('unavailable available')
                                        .addClass('soldout')
                                        .find('.single-action-selector')
                                        .attr('data-variant-id', optionUnavailable.title);
                                    item.find('input[type="radio"]').prop('disabled', false);
                                }
                            } else {
                                item.removeClass('soldout unavailable').addClass('available');
                                item.find('input[type="radio"]').prop('disabled', false);
                            }
                            
                        });
                        break;
                    case 2:
                        swatch.each((idx, elt) => {
                            var item = $(elt),
                                swatchVal = item.data('value');

                            var optionSoldout = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == selectedOption1 && variant.option1 == selectedOption2 && variant.option3 == swatchVal && variant.available;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == selectedOption1 && variant.option1 == selectedOption2 && variant.option2 == swatchVal && variant.available;
                                    } else {
                                        return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal && variant.available;
                                    }
                                }
                            });

                            var optionUnavailable = variantList.find((variant) => {
                                if (optionColor == 1) {
                                    return variant.option2 == selectedOption1 && variant.option1 == selectedOption2 && variant.option3 == swatchVal;
                                } else {
                                    if (optionColor == 2) {
                                        return variant.option3 == selectedOption1 && variant.option1 == selectedOption2 && variant.option2 == swatchVal;
                                    } else {
                                        return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal;
                                    }
                                }
                            });

                            if(optionSoldout == undefined){
                                if (optionUnavailable == undefined) {
                                    item.removeClass('soldout available').addClass('unavailable');
                                    item.find('input[type="radio"]').prop('checked', false);
                                } else {
                                    item
                                        .removeClass('unavailable available')
                                        .addClass('soldout')
                                        .find('.single-action-selector')
                                        .attr('data-variant-id', optionUnavailable.title);
                                    item.find('input[type="radio"]').prop('disabled', false);
                                }
                            } else {
                                item.removeClass('unavailable soldout').addClass('available');
                                item.find('input[type="radio"]').prop('disabled', false);
                            }
                        });

                        break;  
                }
            });

            variantPopup.find('.selector-wrapper:not(.option-color)').each((index, element) => {
                var item = $(element);

                if (item.find('.swatch-element').find('input:checked').length < 1) {
                    if (item.find('.swatch-element.available').length > 0) {
                        item.find('.swatch-element.available').eq('0').find('.single-label').trigger('click');
                    } else {
                        item.find('.swatch-element.soldout').eq('0').find('.single-label').trigger('click');
                    }
                }
            });

  
            if ($body.hasClass('quick_shop_option_2')) {
                var variantId = product.find('[data-quickshop]').eq(1).find('[name="id"]').val();
                var arrayInVarName = `quick_view_inven_array_${productId}`,
                    inven_array = window[arrayInVarName]; 
                  
                if(inven_array != undefined) {
                    var inven_num = inven_array[variantId],
                        inventoryQuantity = parseInt(inven_num),
                        quantityInput = product.find('input[name="quantity"]').eq(0);
                    
                    quantityInput.attr('data-inventory-quantity', inventoryQuantity);
                    if (quantityInput.val() > inventoryQuantity) {
                        if (inventoryQuantity > 0) {
                            quantityInput.val(inventoryQuantity)
                        } else {
                            quantityInput.val(1)
                        }
                    }
                }
            }
        },
        
        initAddToCartQuickShop: function($target, popup){
            var variantId = popup.find('[name="id"]').val(),
                qty = 1;

            halo.actionAddToCart($target, variantId, qty);
            
        },

        initAddToCart: function() {
            $doc.off('click.addToCart').on('click.addToCart', '[data-btn-addtocart]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.target),
                    product = $target.parents('.product-item'),
                    MobilePopup_Option_2 = $doc.find('#halo-card-mobile-popup'),
                    ProductQuickShopShown_Option_2 = $doc.find('.quickshop-popup-show');

                if($target.closest('product-form').length > 0){
                    var productForm = $target.closest('form');
                    
                    halo.actionAddToCart2($target, productForm);
                } else {
                    if(!$target.hasClass('is-notify-me') && !$target.hasClass('is-soldout')){
                        var form = $target.parents('form'),
                            variantId = form.find('[name="id"]').val(),
                            qty = form.find('[name="quantity"]').val(),
                            input = form.find('[name="quantity"]').eq(0);
                        if(qty == undefined){
                            qty = 1;
                        }

                        if ($('.recipient-form').length > 0) {
                            $('#product-add-to-cart').trigger("click");
                        } else {
                            halo.actionAddToCart($target, variantId, qty, input);
                        }
                    
                    } else if($target.hasClass('is-notify-me')){
                        halo.notifyInStockPopup($target);
                    }
                }
            });
            
            $doc.on('click', '[data-close-add-to-cart-popup]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                $body.removeClass('add-to-cart-show');
            });


            $doc.on('click', (event) => {
                if($body.hasClass('add-to-cart-show')){
                    if (($(event.target).closest('[data-add-to-cart-popup]').length === 0)) {
                        $body.removeClass('add-to-cart-show');
                    }
                }
            });
        },

        actionAddToCart: function($target, variantId, qty, input){
            var originalMessage = window.variantStrings.submit,
                waitMessage = window.variantStrings.addingToCart,
                successMessage = window.variantStrings.addedToCart;

            if($target.hasClass('button-text-change')){
                originalMessage = $target.text();
            }

            $target.addClass('is-loading');

            if($body.hasClass('quick-view-show')){
                Shopify.addItem(variantId, qty, $target, () => {
                    switch (window.after_add_to_cart.type) {
                        case 'cart':
                            halo.redirectTo(window.routes.cart);

                            break;
                        case 'quick_cart':
                            if(window.quick_cart.show){
                                Shopify.getCart((cart) => {
                                    if( window.quick_cart.type == 'popup'){
                                    } else {
                                        $body.addClass('cart-sidebar-show');
                                        halo.updateSidebarCart(cart);
                                    }
                                    if (cart.item_count >= 100){
                                        $body.find('.cart-count-bubble [data-cart-count]').text(window.cartStrings.item_99);
                                    }

                                    $target.removeClass('is-loading');
                                    $('.background-overlay').removeClass('hold');
                                });
                            } else {
                                halo.showWarning(window.after_add_to_cart.message_2);
                                $target.removeClass('is-loading');
                                halo.showWarning(window.after_add_to_cart.message_2);
                                Shopify.getCart((cart) => {
                                    $body.find('[data-cart-count]').text(cart.item_count);
                                    if (cart.item_count >= 100){
                                        $body.find('.cart-count-bubble [data-cart-count]').text(window.cartStrings.item_99);
                                    }
                                    if (cart.item_count == 1){
                                        $body.find('[data-cart-text]').text(window.cartStrings.item);
                                    } else {
                                        $body.find('[data-cart-text]').text(window.cartStrings.items);
                                    }
                                });
                            }

                            break;
                        case 'popup_cart_1':
                            Shopify.getCart((cart) => {
                                halo.updatePopupCart(cart, 1, variantId);
                                //halo.updateSidebarCart(cart);
                                $body.addClass('add-to-cart-show');
                                $body.removeClass('quick-view-show');
                                $target.removeClass('is-loading');
                                if (cart.item_count >= 100){
                                    $body.find('.cart-count-bubble [data-cart-count]').text(window.cartStrings.item_99);
                                }
                                $('.background-overlay').removeClass('hold');
                            });

                            break;
                    }
                }, input);
            } else if($body.hasClass('template-cart')) {
                Shopify.addItem(variantId, qty, $target, () => {
                    // $target.text(successMessage);
                    halo.redirectTo(window.routes.cart);
                }, input);
            } else {
                Shopify.addItem(variantId, qty, $target, () => {
                    // $target.text(successMessage);
                    $target.removeClass('is-loading');
                    if ($body.hasClass('quickshop-popup-show') && $body.hasClass('quick_shop_option_3')) {
                        $body.removeClass('quickshop-popup-show');
                        
                        $('.quickshop-popup-show').removeClass('quickshop-popup-show');
                    }

                    if ($body.hasClass('quickshop-list-view-show')) {
                        $body.removeClass('quickshop-list-view-show')
                    }

                    if ($body.hasClass('show-mobile-options')) {
                        $body.removeClass('show-mobile-options');
                        $('.background-overlay').addClass('hold');
                    }

                    if ($body.hasClass('quick_shop_popup_mobile') && $body.hasClass('quick_shop_option_1') || $body.hasClass('quick_shop_option_2')) {
                        // setTimeout(() => {
                            $body.removeClass('quick_shop_popup_mobile');
                            $doc.find('#halo-card-mobile-popup').removeClass('show');
                            $doc.find('.quickshop-popup-show').each((index, popup) => {
                                $(popup).removeClass('quickshop-popup-show');
                            })
                        // }, 200);
                    }

                    switch (window.after_add_to_cart.type) {
                        case 'cart':
                            halo.redirectTo(window.routes.cart);

                            break;
                        case 'quick_cart':
                            if(window.quick_cart.show){
                                Shopify.getCart((cart) => {
                                    if( window.quick_cart.type == 'popup'){
                                    } else {
                                        $body.addClass('cart-sidebar-show');
                                        halo.updateSidebarCart(cart);
                                    }
                                    $target.removeClass('is-loading');
                                    $('.background-overlay').removeClass('hold');
                                    if (cart.item_count >= 100){
                                        $body.find('.cart-count-bubble [data-cart-count]').text(window.cartStrings.item_99);
                                    }
                                });

                            } else {
                                halo.showWarning(window.after_add_to_cart.message_2);
                                Shopify.getCart((cart) => {
                                    $body.find('[data-cart-count]').text(cart.item_count);
                                    if (cart.item_count >= 100){
                                        $body.find('.cart-count-bubble [data-cart-count]').text(window.cartStrings.item_99);
                                    }
                                    if (cart.item_count == 1){
                                        $body.find('[data-cart-text]').text(window.cartStrings.item);
                                    } else {
                                        $body.find('[data-cart-text]').text(window.cartStrings.items);
                                    }
                                });
                            }

                            break;
                        case 'popup_cart_1':
                            Shopify.getCart((cart) => {
                                halo.updatePopupCart(cart, 1, variantId);
                                $body.addClass('add-to-cart-show');
                                $target.removeClass('is-loading');
                                $('.background-overlay').removeClass('hold');
                                if (cart.item_count >= 100){
                                    $body.find('.cart-count-bubble [data-cart-count]').text(window.cartStrings.item_99);
                                }
                            });

                            break;
                    }
                }, input);
            }
        },

        actionAddToCart2: function($target, productForm) {
            const config = fetchConfig('javascript');
            config.headers['X-Requested-With'] = 'XMLHttpRequest';
            delete config.headers['Content-Type'];
            var originalMessage = window.variantStrings.submit,
                waitMessage = window.variantStrings.addingToCart,
                successMessage = window.variantStrings.addedToCart;
            
            if($target.hasClass('button-text-change')){
                originalMessage = $target.text();
            }

            $target.addClass('is-loading');

            let addToCartForm = document.querySelector('[data-type="add-to-cart-form"]');
            let formData = new FormData(addToCartForm);

            const properties = document.querySelectorAll('.line-item-property__field [name^="properties"]')

            properties.forEach(property => {
              if (property.value == null) return;
                if (property.type == 'file') {
                  formData.append(property.name, property.files[0])
                } else {
                  formData.append(property.name, property.value)
                }
            })

            const enoughInStock = halo.checkSufficientStock(productForm);
            if (!enoughInStock && $body.hasClass('quickshop-popup-show')) {
                alert(window.cartStrings.addProductOutQuantity);
                $target.removeClass('is-loading');
                return 
            }

            const addItemToCart = (variantId) => {
                fetch(window.Shopify.routes.root + 'cart/add.js', {...config, ...{
                        method: 'POST',
                        body: formData
                    }
                })
                .then(response => {
                    return response.json();
                })
                .catch((error) => {
                    console.error('Error:', error);
                })
                .finally(() => {
                    if ($body.hasClass('quickshop-popup-show')) {
                        $body.removeClass('quickshop-popup-show');
                    }
    
                    if($body.hasClass('quick-view-show')){
                        if (window.after_add_to_cart.type == 'cart') {
                            halo.redirectTo(window.routes.cart);
                        } else {
                            Shopify.getCart((cartTotal) => {
                                $body.find('[data-cart-count]').text(cartTotal.item_count);
                                $target.removeClass('is-loading');
                                if (cart.item_count >= 100){
                                    $body.find('.cart-count-bubble [data-cart-count]').text(window.cartStrings.item_99);
                                }
                            });
                        }
                    } else {
                        switch (window.after_add_to_cart.type) {
                            case 'cart':
                                halo.redirectTo(window.routes.cart);
                            
                                break;
                            case 'quick_cart':
                                if(window.quick_cart.show){
                                    Shopify.getCart((cart) => {
                                        if( window.quick_cart.type == 'popup'){
                                            // $body.addClass('cart-modal-show');
                                            // halo.updateDropdownCart(cart);
                                        } else {
                                            $body.addClass('cart-sidebar-show');
                                            halo.updateSidebarCart(cart);
                                        }
                                        if (cart.item_count >= 100){
                                            $body.find('.cart-count-bubble [data-cart-count]').text(window.cartStrings.item_99);
                                        }
                                        $target.removeClass('is-loading');
                                    });
                                } else {
                                    halo.redirectTo(window.routes.cart);
                                }
                                
                                break;
                            case 'popup_cart_1':
                                Shopify.getCart((cart) => {
                                    halo.updatePopupCart(cart, 1, variantId);
                                    halo.updateSidebarCart(cart);
                                    $body.addClass('add-to-cart-show');
                                    $target.removeClass('is-loading');
                                    if (cart.item_count >= 100){
                                        $body.find('.cart-count-bubble [data-cart-count]').text(window.cartStrings.item_99);
                                    }
                                });
    
                                break;
                        }
                    }
                });
            }

            fetch(window.Shopify.routes.root + 'cart.js', {
                method: 'GET',
            })
            .then(response => {
                return response.json();
            }).then(response => { 
                const variantId = parseInt($(addToCartForm).serialize().split('id=')[1])
                const item = response.items.find(item => item.variant_id == variantId)
                const currentQuantity = item?.quantity 
                const currentProductId = item?.product_id
                const moreQuantity = parseInt(productForm.find('[data-inventory-quantity]').val()) 
                const maxQuantity = parseInt(productForm.find('[data-inventory-quantity]').data('inventory-quantity'))
                const saleOutStock = document.getElementById('product-add-to-cart').dataset.available === 'true' | false

                if (!currentQuantity || !maxQuantity || saleOutStock) return addItemToCart(variantId)
                var arrayInVarName = `selling_array_${currentProductId}`,
                itemInArray = window[arrayInVarName],
                itemStatus = itemInArray[variantId];
                if(itemStatus == 'deny') {
                    if (currentQuantity + moreQuantity > maxQuantity)  {
                        if(maxQuantity < 0){
                            addItemToCart(variantId);
                        } else {
                            const remainingQuantity = maxQuantity - currentQuantity 
                            throw new Error(`You ${remainingQuantity > 0 ? `can only add ${remainingQuantity}` : 'cannot add'} more of the items into the cart`)
                        }
                    } else {
                        addItemToCart(variantId);
                    }
                } else {
                  addItemToCart(variantId);
                }
            }).catch(err => {
                this.showWarning(err)
            }).finally(() => {
                $target.removeClass('is-loading');
            })
        },

        checkSufficientStock: function(productForm) {
            const maxValidQuantity = productForm.find('[data-inventory-quantity]').data('inventory-quantity')
            const inputQuantity = parseInt(productForm.find('[data-inventory-quantity]').val())
            
            return maxValidQuantity >= inputQuantity
        },  

        updateContentQuickshopOption3: function(handle){
            var quickShopPopup = $('#halo-quickshop-popup-option-3'),
                quickShopPopupContent = quickShopPopup.find('.halo-popup-content');

            $.ajax({
                type: 'get',
                url: window.routes.root + '/products/' + handle + '?view=ajax_quick_shop',
                beforeSend: function () {
                    $('[data-quick-view-popup] .halo-popup-content').empty()
                },
                success: function (data) {
                    quickShopPopupContent.html(data);       
                },
                error: function (xhr, text) {
                    // alert($.parseJSON(xhr.responseText).description);
                    halo.showWarning($.parseJSON(xhr.responseText).description);
                },
                complete: function () {
                    var $scope = quickShopPopup.find('.quickshop');
                    
                    halo.productImageGallery($scope);
                    setTimeout(() => {
                        $body.addClass('quickshop-popup-show');
                    }, 150)
                }
            });
        },

        updateContentQuickBulk: function(handle, $target){
            const quickBulkPopup = $('#halo-quick-bulk-popup'),
                quickBulkPopupContent = quickBulkPopup.find('.halo-popup-content');

            $.ajax({
                type: 'get',
                url: window.routes.root + '/products/' + handle + '?view=ajax_quick_bulk',
                beforeSend: function () {
                    $target.addClass('is-loading');
                    $('[data-quick-view-popup] .halo-popup-content').empty();
                },
                success: function (data) {
                    quickBulkPopupContent.html(data);       
                },
                error: function (xhr, text) {
                    halo.showWarning($.parseJSON(xhr.responseText).description);
                },
                complete: function () {
                    var $scope = quickBulkPopup.find('.quickshop');
                    halo.productImageGallery($scope);
                    setTimeout(() => {$target.removeClass('is-loading')}, 100);
                }
            });
        },
        
        appendProductQuickShopOption2: function(product) {
            //  Append Product Popup Quick Shop 2 Show Mobile
            if (window.innerWidth <= 767) {
                var quickshopMobilePopup = $doc.find('#halo-card-mobile-popup');
                var quickshopForm = product.clone();
                quickshopMobilePopup.find('.halo-popup-content').empty();
                quickshopForm.find('.card-product__group').remove();
                quickshopMobilePopup.find('.halo-popup-content').append(quickshopForm);

                var form = quickshopMobilePopup.find('[data-quickshop] form').eq('0');
                var mobilePopupId = form.attr('id') + 'mobile';
                form.attr('id', mobilePopupId);
                var optionInputs = form.find('.single-option');
                var optionLabels = form.find('.single-label');

                optionInputs.each((index, optionInput) => {
                    $(optionInput).attr('id', $(optionInput).attr('id') + '-mobile');
                })
                
                optionLabels.each((index, optionLabel) => {
                    $(optionLabel).attr('for', $(optionLabel).attr('for') + '-mobile');
                })

                quickshopMobilePopup.addClass('show');

                $body.addClass("quick_shop_popup_mobile");

                $doc.on('click', (e) => {
                    var $target = $(e.target)
                    if ($target.hasClass('background-overlay')) {
                        quickshopMobilePopup.removeClass('show');
                        $body.removeClass('quick_shop_popup_mobile');
                        product.removeClass('quickshop-popup-show');
                    }
                })
            } 
        },

        isRunningInIframe: function() {
            try {
                return window.self !== window.top;
            } catch (e) {
                return true;
            }
        },

        redirectTo: function(url){
            if (halo.isRunningInIframe() && !window.iframeSdk) {
                window.top.location = url;
            } else {
                window.location = url;
            }
        },

        initQuickCart: function() {
            if(window.quick_cart.show){
                if(window.quick_cart.type == 'popup'){
                    // halo.initDropdownCart();
                } else {
                    halo.initSidebarCart();
                }
            }

            halo.initEventQuickCart();
        },

        initEventQuickCart: function(){
            halo.removeItemQuickCart();
            halo.updateQuantityItemQuickCart();
            halo.editQuickCart();
        },

        productCollectionCartSlider: function(){
            var productCart = $('[data-product-collection-cart]');

            productCart.each((index, element) => {
                var self = $(element),
                    productGrid = self.find('.products-carousel'),
                    itemDots = productGrid.data('item-dots'),
                    itemArrows = productGrid.data('item-arrows');

                if(productGrid.length > 0){
                    if(!productGrid.hasClass('slick-initialized')){
                        productGrid.slick({
                            mobileFirst: true,
                            adaptiveHeight: false,
                            infinite: false,
                            vertical: false,
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            dots: true,
                            arrows: false,
                            nextArrow: window.arrows.icon_next,
                            prevArrow: window.arrows.icon_prev,
                            rtl: window.rtl_slick,
                            responsive: [
                            {
                                breakpoint: 1025,
                                settings: {
                                    dots: itemDots,
                                    arrows: itemArrows
                                }
                            }]
                        });
                    }
                }
            });
        },

        updatePopupCart: function(cart, layout, variantId) {
            var item = cart.items.filter(item => item.id == variantId)[0],
                popup = $('[data-add-to-cart-popup]'),
                product = popup.find('.product-added'),
                productTitle = product.find('.product-title'),
                productImage = product.find('.product-image'),
                title = item.title || item.product_title,
                image = item.featured_image,
                img = '<img src="'+ image.url +'" alt="'+ image.alt +'" title="'+ image.alt +'"/>';

            productImage.attr('href', item.url).html(img);

            productTitle
                .find('.title')
                .attr('href', item.url)
                .empty()
                .append(title);

            Shopify.getCart((cartTotal) => {
                $body.find('[data-cart-count]').text(cartTotal.item_count);
            });
        },

        initSidebarCart: function() {
            var cartIcon = $('[data-cart-sidebar]');
            let checkInitSideBarCart = true;
            cartIcon.on('click', () => {
                if (!checkInitSideBarCart) return
                checkInitSideBarCart = false
                Shopify.getCart((cart) => {
                    halo.updateSidebarCart(cart);
                })
                if ($('body').hasClass('cursor-fixed__show')){
                    window.sharedFunctionsAnimation.onEnterButton();
                    window.sharedFunctionsAnimation.onLeaveButton();
                }
            })
            if ($body.hasClass('template-cart')) {
                cartIcon.on('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    $('html, body').animate({
                        scrollTop: 0
                    }, 700);
                });
                if (halo.checkNeedToConvertCurrency()) {
                  Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                };
            } else {
                cartIcon.on('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    
                    $body.addClass('cart-sidebar-show');
                });
            }

            $doc.on('click', '[data-close-cart-sidebar]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                if ($body.hasClass('cart-sidebar-show')) {
                    $body.removeClass('cart-sidebar-show');
                }
            });

            $body.on('click', '.background-overlay', (event) => {
                if ($body.hasClass('cart-sidebar-show') && !$body.hasClass('quickshop-popup-show') && !$body.hasClass('quick_shop_popup_mobile') && !$body.hasClass('edit-cart-show') && !$body.hasClass('term-condition-show') && !$body.hasClass('has-warning')) {
                    if (($(event.target).closest('#halo-cart-sidebar').length === 0) && 
                        ($(event.target).closest('[data-cart-sidebar]').length === 0) && 
                        ($(event.target).closest('[data-edit-cart-popup]').length === 0) && 
                        ($(event.target).closest('[data-warning-popup]').length === 0) && 
                        ($(event.target).closest('[data-term-condition-popup]').length === 0)){
                        $body.removeClass('cart-sidebar-show');
                    }
                }
            })
        },

        updateSidebarCart: function(cart) {
            if(!$.isEmptyObject(cart)){
                const $cartDropdown = $('#halo-cart-sidebar .halo-sidebar-wrapper .previewCart-wrapper');
                const $cartLoading = '<div class="loading-overlay loading-overlay--custom">\
                        <div class="loading-overlay__spinner">\
                            <svg aria-hidden="true" focusable="false" role="presentation" class="spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">\
                                <circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle>\
                            </svg>\
                        </div>\
                    </div>';
                const loadingClass = 'is-loading';

                $cartDropdown
                    .addClass(loadingClass)
                    .prepend($cartLoading);

                $.ajax({
                    type: 'GET',
                    url: window.routes.root + '/cart?view=ajax_side_cart',
                    cache: false,
                    success: function (data) {
                        var response = $(data);

                        $cartDropdown
                            .removeClass(loadingClass)
                            .html(response);

                        halo.dispatchChangeForShippingMessage();
                    },
                    error: function (xhr, text) {
                        halo.showWarning($.parseJSON(xhr.responseText).description);
                    },
                    complete: function () {
                        $body.find('[data-cart-count]').text(cart.item_count);
                        if (cart.item_count >= 100){
                            $body.find('.cart-count-bubble [data-cart-count]').text(window.cartStrings.item_99);
                        }
                        if (cart.item_count == 1){
                            $body.find('[data-cart-text]').text(window.cartStrings.item);
                        } else {
                            $body.find('[data-cart-text]').text(window.cartStrings.items);
                        }
                        halo.productCollectionCartSlider();
                        halo.updateGiftWrapper();
                        if (halo.checkNeedToConvertCurrency()) {
                          Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                        };
                        document.dispatchEvent(new CustomEvent('cart-update', { detail: cart }));
                        if ($('body').hasClass('cursor-fixed__show')){
                            window.sharedFunctionsAnimation.onEnterButton();
                            window.sharedFunctionsAnimation.onLeaveButton();
                        }
                    }
                });
            }
        },

        dispatchChangeForShippingMessage: function() {
            document.querySelectorAll('[data-free-shipping-wrapper]').forEach(freeShippingWrapper => {
                const changeEvent = new Event('change', { bubbles: true })
                freeShippingWrapper.dispatchEvent(changeEvent);
            })
        },

        updateGiftWrapper: function() {
            let debounce 
            $('#gift-wrapping').off('click').on('click', (event) => {
                event.stopPropagation()
                event.preventDefault()
                const $target = $(event.currentTarget);
                clearTimeout(debounce)
                debounce = setTimeout(() => {
                    const variantId = event.target.dataset.giftId;
                    Shopify.addItem(variantId, 1, $target, () => {
                        Shopify.getCart((cart) => {
                            halo.updateSidebarCart(cart);
                        });
                    }); 
                }, 250)
            });

            $('#cart-gift-wrapping').off('click').on('click', (event) => {
                event.stopPropagation()
                event.preventDefault()

                var $target = $(event.currentTarget),
                    text = $target.attr('data-adding-text');
                $target.text(text);

                clearTimeout(debounce)
                debounce = setTimeout(() => {
                    const variantId = event.target.dataset.giftId;
                    Shopify.addItem(variantId, 1, $target, () => {
                        Shopify.getCart((cart) => {
                            halo.updateCart(cart)
                        });
                    }); 
                }, 250)
            });
        },

        removeItemQuickCart: function () {
            $doc.on('click', '[data-cart-remove]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.currentTarget),
                    productId = $target.attr('data-cart-remove-id'),
                    text = $('#cart-gift-wrapping').attr('data-add-text'),
                    productLine = $target.data('line'),
                    index = $target.data('index');

                $('#cart-gift-wrapping').text(text);

                Shopify.removeItem(productLine, index, (cart) => {
                    if($body.hasClass('template-cart')){
                        halo.updateCart(cart);
                    } else if($body.hasClass('cart-modal-show')){
                        // halo.updateDropdownCart(cart);
                    } else if($body.hasClass('cart-sidebar-show')) {
                        halo.updateSidebarCart(cart);
                    }
                });
            });
        },

        updateCart: function(cart){
            if(!$.isEmptyObject(cart)){
                const $sectionId = $('#main-cart-items').data('id');
                const $cart = $('[data-cart]')
                const $cartContent = $cart.find('[data-cart-content]');
                const $cartTotals = $cart.find('[data-cart-total]');
                const $cartLoading = '<div class="loading-overlay loading-overlay--custom">\
                        <div class="loading-overlay__spinner">\
                            <svg aria-hidden="true" focusable="false" role="presentation" class="spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">\
                                <circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle>\
                            </svg>\
                        </div>\
                    </div>';
                const loadingClass = 'is-loading';

                $cart
                    .addClass(loadingClass)
                    .prepend($cartLoading);

                $.ajax({
                    type: 'GET',
                    url: `/cart?section_id=${$sectionId}`,
                    cache: false,
                    success: function (data) {
                        var jsPreventedData = data.replaceAll('cart-coupon-discount', 'div');
                        var response = $(jsPreventedData);

                        $cart.removeClass(loadingClass);
                        $cart.find('.loading-overlay').remove();

                        if(cart.item_count > 0){
                            var contentCart =  response.find('[data-cart-content] .cart').html(),
                                subTotal = response.find('[data-cart-total] .cart-total-subtotal').html(),
                                grandTotal = response.find('[data-cart-total] .cart-total-grandtotal').html(),
                                savings = response.find('[data-cart-total] .cart-total-savings').html();

                            $cartContent.find('.cart').html(contentCart);
                            $cartTotals.find('.cart-total-subtotal').html(subTotal);
                            $cartTotals.find('.cart-total-grandtotal').html(grandTotal);
                            $cartTotals.find('.cart-total-savings').html(savings);

                            if(response.find('.haloCalculatorShipping').length > 0){
                                var calculatorShipping = response.find('.haloCalculatorShipping');

                                $cart.find('.haloCalculatorShipping').replaceWith(calculatorShipping);
                            }
                        } else {
                            var contentCart =  response.find('#main-cart-items').html(),
                                headerCart =  response.find('.page-header').html();
                                cartCountdownText1 = response.find('.cart-countdown').data('coundown-text-empty-1');
                                cartCountdownText2 = response.find('.cart-countdown').data('coundown-text-empty-2');
                                cartCountdownProductUrl = response.find('.cart-countdown').data('coundown-prd-empty-url');
                                cartCountdownProductTitle = response.find('.cart-countdown').data('coundown-prd-empty-title');
                            var cartCountdownHtml = cartCountdownText1 + ' <a href="'+ cartCountdownProductUrl +'" class="cart-countdown-product link-effect p-relative"><span class="text">'+ cartCountdownProductTitle +'</span></a> ' + cartCountdownText2;

                            $('#main-cart-items').html(contentCart);
                            $('.page-header').html(headerCart);
                            $('.cart-countdown .text-wrap').html(cartCountdownHtml);
                        }
                    },
                    error: function (xhr, text) {
                        halo.showWarning($.parseJSON(xhr.responseText).description);
                    },
                    complete: function () {
                        $body.find('[data-cart-count]').text(cart.item_count);
                        halo.dispatchChangeForShippingMessage();
                        if (halo.checkNeedToConvertCurrency()) {
                            Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                        }
                        if ($body.hasClass('template-cart')) {
                            const giftWrapping = document.getElementById('cart-gift-wrapping')
                            const isChecked = giftWrapping?.dataset.isChecked
                            const variantId = giftWrapping?.dataset.giftId
                            if (isChecked === 'true') {
                                $('#is-a-gift').hide()
                                const giftCardRemoveButton = document.querySelector(`[data-cart-remove-id="${variantId}"]`)
                                const giftCardQuantityInput = document.querySelector(`[data-cart-quantity-id="${variantId}"]`)

                                giftCardRemoveButton?.addEventListener('click', () => {
                                    giftWrapping.dataset.isChecked = 'false'
                                })

                                giftCardQuantityInput?.addEventListener('change', (e) => {
                                    const value = Number(e.target.value)
                                    if (value  <= 0) {
                                        giftWrapping.dataset.isChecked = 'false'
                                    }
                                })
                            } else {
                                $('#is-a-gift').show()
                            }
                            if (cart.item_count >= 100){
                                $body.find('.cart-count-bubble [data-cart-count]').text(window.cartStrings.item_99);
                            }
                        }
                        
                        document.dispatchEvent(new CustomEvent('cart-update', { detail: cart }));
                    }
                });
            }
        },

        updateQuantityItemQuickCart: function(){
            $doc.on('change', '[data-cart-quantity]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.currentTarget),
                    productId = $target.attr('data-cart-quantity-id'),
                    productLine = $target.data('line'),
                    quantity = parseInt($target.val()),
                    stock = parseInt($target.data('inventory-quantity')),
                    index = $target.data('index');
                let enoughInStock = true;

                if ($target.parents('.quick-order-list__contents').length) return;
               
                if (stock < quantity && stock > 0) {
                  var arrayInVarName = `cart_selling_array_${event.currentTarget.closest('cart-update-quantity').dataset.product}`,
                    itemInArray = window[arrayInVarName],
                    itemStatus = itemInArray[event.currentTarget.closest('cart-update-quantity').dataset.variant];
                  if(itemStatus == 'deny') {
                    quantity = stock;
                    enoughInStock = false;
                  }
                }

                Shopify.changeItem(productLine, quantity, index, (cart) => {
                    if($body.hasClass('template-cart')){
                        halo.updateCart(cart);
                    } else if($body.hasClass('cart-modal-show')){
                        // halo.updateDropdownCart(cart);
                    } else if($body.hasClass('cart-sidebar-show')) {
                        halo.updateSidebarCart(cart);
                    }
                    if (!enoughInStock) halo.showWarning(`${ window.cartStrings.addProductOutQuantity.replace('[maxQuantity]', quantity) }`)
                });
            });
        },

        editQuickCart: function() {
            let checkLoadEC = true; 

            $doc.on('click', '[data-open-edit-cart]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.currentTarget),
                    url = $target.data('edit-cart-url'),
                    itemId = $target.data('edit-cart-id'),
                    itemLine = $target.data('line'),
                    itemIndex = $target.data('index'),
                    quantity = $target.data('edit-cart-quantity'),
                    option = $target.parents('.previewCartItem').find('previewCartItem-variant').text();

                const modal = $('[data-edit-cart-popup]'),
                    modalContent = modal.find('.halo-popup-content');

                if (checkLoadEC) {
                    checkLoadEC = false;
                    const $editCart = document.querySelector('.halo-edit-cart-popup');
                    const urlStyleEC = $editCart.dataset.urlStyleEditCart;
                    const urlScriptEC = $editCart.dataset.urlScriptEditCart;
    
                    halo.buildStyleSheet(urlStyleEC, $editCart);
                    halo.buildScript(urlScriptEC);
                }

                $.ajax({
                    type: 'get',
                    url: url,
                    cache: false,
                    dataType: 'html',
                    beforeSend: function() {
                        if($body.hasClass('template-cart')){
                            // halo.showLoading();
                        }
                    },
                    success: function(data) {
                        modalContent.html(data);
                        modalContent
                            .find('[data-template-cart-edit]')
                            .attr({
                                'data-cart-update-id': itemId,
                                'data-line': itemLine,
                                'data-index': itemIndex
                            });

                        var productItem = modalContent.find('.product-edit-item');
                        productItem.find('input[name="quantity"]').val(quantity);
                    },
                    error: function(xhr, text) {
                        // alert($.parseJSON(xhr.responseText).description);
                        halo.showWarning($.parseJSON(xhr.responseText).description);
                        if($body.hasClass('template-cart')){
                            // halo.hideLoading();
                        }
                    },
                    complete: function () {
                        $body.addClass('edit-cart-show');

                        if($body.hasClass('template-cart')){
                            // halo.hideLoading();
                        }

                        if (halo.checkNeedToConvertCurrency()) {
                            Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                        };

                        if ($('body').hasClass('cursor-fixed__show')){
                            window.sharedFunctionsAnimation.onEnterButton();
                            window.sharedFunctionsAnimation.onLeaveButton();
                        }
                    }
                });
            });

            $doc.on('click', '[data-close-edit-cart]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                $body.removeClass('edit-cart-show');
            });

            $doc.on('click', (event) => {
                if ($body.hasClass('edit-cart-show')) {
                    if (($(event.target).closest('[data-edit-cart-popup]').length === 0) && ($(event.target).closest('[data-open-edit-cart]').length === 0)){
                        $body.removeClass('edit-cart-show');
                    }
                }
            });

            halo.addMoreItemEditCart();
            halo.addAllItemCartEdit();
        },

        addMoreItemEditCart: function(){
            $doc.on('click', '[data-edit-cart-add-more]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var itemWrapper = $('[data-template-cart-edit]'),
                    currentItem = $(event.target).parents('.product-edit-item'),
                    count = parseInt(itemWrapper.attr('data-count')),
                    cloneProduct = currentItem.clone().removeClass('product-edit-itemFirst');
                    cloneProductId = cloneProduct.attr('id') + count;

                cloneProduct.attr('id', cloneProductId);

                halo.updateClonedProductAttributes(cloneProduct, count);

                cloneProduct.insertAfter(currentItem);

                count = count + 1;
                itemWrapper.attr('data-count', count);

                if ($('body').hasClass('cursor-fixed__show')){
                    window.sharedFunctionsAnimation.onEnterButton();
                    window.sharedFunctionsAnimation.onLeaveButton();
                }
            });

            $doc.on('click', '[data-edit-cart-remove]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var currentItem = $(event.target).parents('.product-edit-item');

                currentItem.remove();
            });
        },

        updateClonedProductAttributes: function(product, count){
            var form = $('.shopify-product-form', product),
                formId = form.attr('id'),
                newFormId = formId + count;

            form.attr('id', newFormId);

            $('.product-form__radio', product).each((index, element) => {
                var formInput = $(element),
                    formLabel = formInput.next(),
                    id = formLabel.attr('for'),
                    newId = id + count,
                    formInputName = formInput.attr('name');

                formLabel.attr('for', newId);

                formInput.attr({
                    id: newId,
                    name: formInputName + count
                });
            });
        },

        addAllItemCartEdit: function() {
            $doc.on('click', '#add-all-to-cart', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.currentTarget),
                    cartEdit = $('[data-template-cart-edit]'),
                    product = cartEdit.find('.product-edit-item.isChecked'),
                    productId = cartEdit.attr('data-cart-update-id'),
                    productLine = cartEdit.data('line'),
                    index = cartEdit.data('index');

                if(product.length > 0){
                    $target.addClass('is-loading');

                    Shopify.removeItem(productLine, index, (cart) => {
                        if(!$.isEmptyObject(cart)) {
                            var productHandleQueue = [];

                            var ajax_caller = function(data) {
                                return $.ajax(data);
                            }

                            product.each((index, element) => {
                                var item = $(element),
                                    variantId = item.find('input[name="id"]').val(),
                                    qty = parseInt(item.find('input[name="quantity"]').val());

                                productHandleQueue.push(ajax_caller({
                                    type: 'post',
                                    url: window.routes.root + '/cart/add.js',
                                    data: 'quantity=' + qty + '&id=' + variantId,
                                    dataType: 'json',
                                    async: false
                                }));
                            });

                            if(productHandleQueue.length > 0) {
                                $.when.apply($, productHandleQueue).done((event) => {
                                    setTimeout(function(){ 
                                        $target.removeClass('is-loading');
                                    }, 1000);

                                    Shopify.getCart((cart) => {
                                        $body.removeClass('edit-cart-show');

                                        if($body.hasClass('template-cart')){
                                            halo.updateCart(cart);
                                        } else if($body.hasClass('cart-modal-show')){
                                            // halo.updateDropdownCart(cart);
                                        } else if($body.hasClass('cart-sidebar-show')) {
                                            halo.updateSidebarCart(cart);
                                        }
                                    });
                                });
                            }
                        }
                    });
                } else {
                    alert(window.variantStrings.addToCart_message);
                }
            });
        },

        initNotifyInStock: function() {
            $doc.on('click', '[data-open-notify-popup]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var $target = $(event.currentTarget);

                halo.notifyInStockPopup($target);
            });

            $doc.on('click', '[data-close-notify-popup]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                $body.removeClass('notify-me-show');
                setTimeout(() => {
                    $('.halo-notify-popup .form-field').removeClass('hidden')
                    $('.halo-notify-popup .form-message').addClass('hidden')
                }, 700)
            });

            $doc.on('click', (event) => {
                if($body.hasClass('notify-me-show')){
                    if (($(event.target).closest('[data-open-notify-popup]').length === 0) && ($(event.target).closest('[data-notify-popup]').length === 0)){
                        $body.removeClass('notify-me-show');
                        setTimeout(() => {
                            $('.halo-notify-popup .form-field').removeClass('hidden')
                            $('.halo-notify-popup .form-message').addClass('hidden')
                        }, 700)
                    }
                }
            });
        },

        notifyInStockPopup: function($target){
            var variant,
                product = $target.parents('.product-item'),
                title = product.find('.card-title').data('product-title'),
                link = window.location.host + product.find('.card-title').data('product-url'),
                popup = $('[data-notify-popup]');

            if($target.hasClass('is-notify-me')){
                variant = product.find('.card-swatch .swatch-label.is-active').attr('title');
            } else {
                variant = $target.data('variant-id');
            }

            popup.find('.halo-notify-product-title').val($.trim(title));
            popup.find('.halo-notify-product-link').val(link);

            if(variant){
                popup.find('.halo-notify-product-variant').val(variant);
            }
            $body.addClass('notify-me-show');
        },

        initAskAnExpert: function(){
            $doc.on('click', '[data-open-ask-an-expert]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var askAnExpert = $('[data-ask-an-expert-popup]'),
                    modalContent = askAnExpert.find('.halo-popup-content'),
                    url;

                if($body.hasClass('template-product')){
                    var handle = $('.productView').data('product-handle');

                    url = window.routes.root + '/products/' + handle + '?view=ajax_ask_an_expert';
                } else if($body.hasClass('quick-view-show')){
                    var handle = $('.halo-quickView').data('product-quickview-handle');

                    url = window.routes.root + '/products/' + handle + '?view=ajax_ask_an_expert';
                } else {
                    url = window.routes.root + '/search?view=ajax_ask_an_expert';
                }

                $.ajax({
                    type: 'get',
                    url: url,
                    beforeSend: function () {
                        modalContent.empty();
                    },
                    success: function (data) {
                        modalContent.html(data);
                    },
                    error: function (xhr, text) {
                        alert($.parseJSON(xhr.responseText).description);
                    },
                    complete: function () {
                        $body.addClass('ask-an-expert-show');
                    }
                });
            });

            $doc.on('click', '[data-close-ask-an-expert]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                $body.removeClass('ask-an-expert-show');
                if($body.hasClass('recently-popup-mb-show')){
                    $body.removeClass('recently-popup-mb-show');
                }
            });

            $doc.on('click', (event) => {
                if($body.hasClass('ask-an-expert-show')){
                    if (($(event.target).closest('[data-open-ask-an-expert]').length === 0) && ($(event.target).closest('#halo-ask-an-expert-popup').length === 0)){
                        $body.removeClass('ask-an-expert-show');
                    }
                }
            });
        },

        resetForm: function(form){
            $('.form-field', form).removeClass('form-field--success form-field--error');
            $('input[type=email], input[type=text], textarea', form).val('');
        },

        formMessage: function() {
            const error = window.location.href.indexOf('form_type=contact') > -1;

            if (window.location.href.indexOf('contact_posted=true') > -1 || error) {
                const formMessage = $(`[data-form-message="${$.cookie('contact_form')}"]`);
                let delay = 400;
                
                if ($body.hasClass('template-product')) delay = 1600;
    
                switch(formMessage.data('form-message')) {
                    case 'ask':
                        setTimeout(() => {$body.addClass('ask-an-expert-show')}, delay)
                        this.changeStateforContactForm(formMessage, error)
                        $('.halo-notify-popup .form-message').addClass('hidden')
                        break;
                    case 'contact':
                        formMessage.removeClass('hidden')
                        this.changeStateforContactForm(formMessage, error)
                        $('.halo-notify-popup .form-message').addClass('hidden')
                        break;
                    case 'notifyMe':
                        $('.halo-notify-popup .form-field').addClass('hidden')
                        setTimeout(() => {$body.addClass('notify-me-show')}, delay)
                        this.changeStateforContactForm(formMessage, error)
                        break;
                }
            }

            $(document).on('click', '[data-button-message]', (event) => {
                $.cookie('contact_form', $(event.target).data('button-message'), {
                    expires: 1,
                    path: '/',
                });
            })
        },

        changeStateforContactForm(formMessage, error) {
            window.history.pushState('object', document.title, location.href.split('?')[0])
            if (error) {$('.newsletter-form__message--error').addClass('hidden'); $('html, body').animate({scrollTop: formMessage.offset().top - window.innerHeight/2}, 700)}
        },

        initCompareProduct: function() {
            var $compareLink = $('[data-compare-link]');

            if(window.compare.show){
                halo.setLocalStorageProductForCompare($compareLink);
                halo.setAddorRemoveProductForCompare($compareLink);
                halo.setProductForCompare();

                $doc.on('click', '[data-close-compare-product-popup]', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    $body.removeClass('compare-product-show');
                });

                $doc.on('click', (event) => {
                    if($body.hasClass('compare-product-show')){
                        if (($(event.target).closest('[data-compare-link]').length === 0) && ($(event.target).closest('[data-compare-product-popup]').length === 0)){
                            $body.removeClass('compare-product-show');
                        }
                    }
                });
            }
        },

        setLocalStorageProductForCompare: function($link) {
            var count = JSON.parse(localStorage.getItem('compareItem')),
                items = $('[data-product-compare-handle]');

            if(count !== null){ 
                if(items.length > 0) {
                    items.each((index, element) => {
                        var item = $(element),
                            handle = item.data('product-compare-handle');

                        if(count.indexOf(handle) >= 0) {
                            item.find('.compare-icon').addClass('is-checked');
                            item.find('.text').text(window.compare.added);
                            item.find('input').prop('checked', true);
                        } else {
                            item.find('.compare-icon').removeClass('is-checked');
                            item.find('.text').text(window.compare.add);
                            item.find('input').prop('checked', false);
                        }
                    });

                    halo.updateCounterCompare($link);
                }
            }
        },

        setAddorRemoveProductForCompare: function($link) {
            $doc.on('change', '[data-product-compare] input', (event) => {
                var $this = $(event.currentTarget),
                    item = $this.parents('.card-compare'),
                    handle = $this.val(),
                    count = JSON.parse(localStorage.getItem('compareItem'));

                count = halo.uniqueArray(count);

                if(event.currentTarget.checked) {
                    item.find('.compare-icon').addClass('is-checked');
                    item.find('.text').text(window.compare.added);
                    item.find('input').prop('checked', true);
                    halo.incrementCounterCompare(count, handle, $link);
                } else {
                    item.find('.compare-icon').removeClass('is-checked');
                    item.find('.text').text(window.compare.add);
                    item.find('input').prop('checked', false);
                    halo.decrementCounterCompare(count, handle, $link);
                }
            });
        },

        setProductForCompare: function() {
            $doc.on('click', '[data-compare-link]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var list = JSON.parse(localStorage.getItem('compareItem'));

                if (list.length <= 1) {
                    alert(window.compare.message);

                    return false;
                } else {
                    halo.updateContentCompareProduct(list, 0);
                }
            });

            $doc.on('click', '[data-compare-remove]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var id = $(event.currentTarget).data('compare-item'),
                    compareTable = $('[data-compare-product-popup] .compareTable'),
                    item = compareTable.find('.compareTable-row[data-product-compare-id="'+ id +'"]'),
                    handle = item.data('compare-product-handle');

                if(compareTable.find('tbody .compareTable-row').length == 1){
                    // alert(window.compare.message);
                    item.remove();
                    var count = JSON.parse(localStorage.getItem('compareItem')),
                        index = count.indexOf(handle),
                        $compareLink = $('[data-compare-link]');

                    if (index > -1) {
                        count.splice(index, 1);
                        count = halo.uniqueArray(count);
                        localStorage.setItem('compareItem', JSON.stringify(count));

                        halo.setLocalStorageProductForCompare($compareLink);
                        halo.updateCounterCompare($compareLink);
                    }

                    $body.removeClass('compare-product-show');
                } else {
                    item.remove();
                    
                    var count = JSON.parse(localStorage.getItem('compareItem')),
                        index = count.indexOf(handle),
                        $compareLink = $('[data-compare-link]');

                    if (index > -1) {
                        count.splice(index, 1);
                        count = halo.uniqueArray(count);
                        localStorage.setItem('compareItem', JSON.stringify(count));

                        halo.setLocalStorageProductForCompare($compareLink);
                        halo.updateCounterCompare($compareLink);
                    }
                }
            });
        },

        updateCounterCompare: function($link) {
            var count = JSON.parse(localStorage.getItem('compareItem'));

            if (count.length > 1) {
                $link.parent().addClass('is-show');
                $link.find('span.countPill').html(count.length);
            } else {
                $link.parent().removeClass('is-show');
            }
        },

        uniqueArray: function(list) {
            var result = [];

            $.each(list, function(index, element) {
                if ($.inArray(element, result) == -1) {
                    result.push(element);
                }
            });

            return result;
        },

        incrementCounterCompare: function(count, item, $link){
            const index = count.indexOf(item);

            count.push(item);
            count = halo.uniqueArray(count);

            localStorage.setItem('compareItem', JSON.stringify(count));

            halo.updateCounterCompare($link);
        },

        decrementCounterCompare: function(count, item, $link){
            const index = count.indexOf(item);

            if (index > -1) {
                count.splice(index, 1);
                count = halo.uniqueArray(count);
                localStorage.setItem('compareItem', JSON.stringify(count));

                halo.updateCounterCompare($link);
            }
        },

        updateContentCompareProduct: function(list, count){
            const compareTable = $('[data-compare-product-popup] .compareTable'),
                url = window.routes.root + '/products/' + list[count] + '?view=ajax_product_card_compare';

            if (count == 0) compareTable.find('tbody').empty();

            if (list.length > count) {
                $.ajax({
                    type: 'get',
                    url: url,
                    cache: false,
                    success: function (data) {
                        compareTable.find('tbody').append(data);
                        count++;
                        halo.updateContentCompareProduct(list, count);
                    }
                });
            } else {
                $body.addClass('compare-product-show');
            }

            if ($('body').hasClass('cursor-fixed__show')){
                window.sharedFunctionsAnimation.onEnterButton();
                window.sharedFunctionsAnimation.onLeaveButton();
            }
        },

        initProductView: function($scope){
            halo.productImageGallery($scope);
            halo.productLastSoldOut($scope);
            halo.productCustomerViewing($scope);
            halo.productCountdown($scope);
            halo.productSizeChart($scope);
            halo.productCustomCursor($scope);
            halo.productVideoGallery($scope);
            halo.initVariantImageGroup($scope, window.variant_image_group);
        },

        initQuickView: function(){
            let checkLoadQV = true;

            $doc.on('click', '[data-open-quick-view-popup]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                if (checkLoadQV) {
                    checkLoadQV = false;
                    const $quickView = document.querySelector('.halo-quick-view-popup');
                    const urlStyleProduct = $quickView.dataset.urlStyleProduct;
                    const urlStyleQV = $quickView.dataset.urlStyleQuickView;
                    const urlVariantsQV = $quickView.dataset.urlVariantsQuickView;
                    const urlSortable = 'https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js';

                    if (!document.body.matches('.qs3-loaded')) halo.buildStyleSheet(urlStyleProduct, $quickView);
                    halo.buildStyleSheet(urlStyleQV, $quickView);
                    halo.buildScript(urlVariantsQV);
                    document.body.classList.add('qv-loaded');
                    if (!document.body.matches('.sortable-loader')) {
                        document.body.classList.add('sortable-loader');
                        halo.buildScript(urlSortable);
                    }
                }

                var handle = $(event.currentTarget).data('product-handle');

                halo.updateContentQuickView(handle);
            });

            $doc.on('click', '[data-close-quick-view-popup]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                $body.removeClass('quick-view-show');
            });
            
            $('.background-overlay').off('click.closeQuickView').on('click.closeQuickView', e => {
                if ($body.hasClass('quick-view-show') &&
                       !$body.hasClass('cart-sidebar-show') && 
                       !$body.hasClass('ask-an-expert-show') && 
                       !$body.hasClass('size-chart-show') && 
                       !$body.hasClass('compare-color-show') && 
                       !$body.hasClass('term-condition-show')
                   ) {
                    $body.removeClass('quick-view-show');
                }
            });
        },

        updateContentQuickView: function(handle){
            var popup = $('[data-quick-view-popup]'),
                popupContent = popup.find('.halo-popup-content');

            $.ajax({
                type: 'get',
                url: window.routes.root + '/products/' + handle + '?view=ajax_quick_view',
                beforeSend: function () {
                    popupContent.empty();
                    $('#halo-quickshop-popup-option-3').find('.halo-popup-content').empty()
                },
                success: function (data) {
                    popupContent.html(data);
                },
                error: function (xhr, text) {
                    alert($.parseJSON(xhr.responseText).description);
                },
                complete: function () {
                    var $scope = popup.find('.quickView');
                    const items = $('.halo-popup-content .halo-compare-color-popup li.item'),
                        tableList = $('.halo-popup-content .halo-compare-color-popup #sortTableList'),
                        compareColorPopup = $('.halo-popup-content .halo-compare-color-popup'),
                        sizeChartPopup = $('.halo-popup-content .halo-size-chart-popup');
                    
                    halo.productImageGallery($scope);
                    halo.productLastSoldOut($scope);
                    halo.productCustomerViewing($scope);
                    halo.productCountdown($scope);
                    halo.productSizeChart($scope);
                    halo.setProductForWishlist(handle);
                    halo.initVariantImageGroup($scope, window.variant_image_group_quick_view);

                    $body.addClass('quick-view-show');

                    if (window.Shopify && Shopify.PaymentButton) {
                        Shopify.PaymentButton.init();
                    }

                    tableList.attr('id', 'quickViewSortTableList');

                    items.each((index, element) => {
                        const itemInput = $(element).find('.swatch-compare-color-option'),
                            itemLabel = $(element).find('.swatch-compare-color-label'),
                            itemId = itemInput.attr('id');

                        itemInput
                            .attr('id', `quickView-${itemId}`)
                            .attr('name', `quickView-${itemId}`);
                        itemLabel.attr('for', `quickView-${itemId}`);
                    });

                    compareColorPopup.attr('id', 'quickView-halo-compare-color-popup');
                    sizeChartPopup.attr('id', 'quickView-halo-size-chart-popup');

                    if ($('.halo-productView .addthis_inline_share_toolbox').length) {
                        var html = $('.halo-productView .addthis_inline_share_toolbox').html();

                        $('.halo-popup-content .share-button__button').click(function(){
                            $('.halo-popup-content .addthis_inline_share_toolbox').append(html);
                        });
                    }

                    const thisSortTable = document.getElementById('quickViewSortTableList');
                    const thisImageList = $('.halo-popup-content .halo-compareColors-image');

                    if (window.innerWidth >= 1025 && thisSortTable) {
                        new Sortable(thisSortTable, {
                            animation: 150
                        });
                    } else {
                        onRemoveHandlerQuickView();
                    }

                    function onRemoveHandlerQuickView(){
                        thisImageList.on('click', '.item', (event) => {
                            event.preventDefault();

                            var $target = event.currentTarget,
                                itemId = $target.classList[1].replace('item-', ''),
                                optionId = `swatch-compare-color-${itemId}`,
                                item = $(document.getElementById(optionId));

                            item.trigger('click');
                        });
                    }

                    if ($('body').hasClass('cursor-fixed__show')){
                        window.sharedFunctionsAnimation.onEnterButton();
                        window.sharedFunctionsAnimation.onLeaveButton();
                    }
                }
            });
        },

        productImageGallery: function($scope) {
            var sliderNav = $scope.find('.productView-nav'),
                sliderFor = $scope.find('.productView-for:not(".mobile")'),
                sliderForMobile = $scope.find('.productView-for.mobile');

            if(!sliderFor.hasClass('slick-initialized') && !sliderNav.hasClass('slick-initialized')) {
                const navArrowsDesk = sliderNav.data('arrows-desk'),
                    navArrowsMobi = sliderNav.data('arrows-mobi'),
                    navCounterMobi = sliderNav.data('counter-mobi'),
                    navMediaCount = sliderNav.data('media-count'),
                    thumbnailToShow = parseInt(sliderFor.data('max-thumbnail-to-show'));
                
                let checkNav, checkFor, navSlideCount;

                var appendTimeout;

                sliderNavHTML = sliderNav.html();

                sliderNav.hasClass('productView-nav-gallery') ? navSlideCount = Math.round(navMediaCount / 2) : navSlideCount = navMediaCount;
                sliderNav.hasClass('productView-horizontal-tabs') && navMediaCount == 2 ? navSlideCount = 1 : navSlideCount = navMediaCount;
                let slickCounter = `<div class="slick-counter">
                    <span class="slick-counter--current">1</span>
                    <span aria-hidden="true">/</span>
                    <span class="slick-counter--total">`+ navSlideCount + `</span>
                </div>`;

                const getSlickCounter = () => {
                    setTimeout(() => {
                        let countSlide = $('.productView-nav .slick-slide').length;
                        if (sliderNav.hasClass('productView-nav-gallery')) countSlide = Math.round(countSlide / 2);
                        slickCounter = `<div class="slick-counter">
                            <span class="slick-counter--current">1</span>
                            <span aria-hidden="true">/</span>
                            <span class="slick-counter--total">`+ countSlide + `</span>
                        </div>`;
                    }, 1000);
                }

                const setSlickCounter = () => {
                    clearTimeout(appendTimeout);
                    appendTimeout = setTimeout(() => {sliderNav.append(slickCounter)}, 1000);
                }

                sliderNav.on('init', () => {
                    if (window.innerWidth < 768 && navCounterMobi) {
                        if (variant_image_group) getSlickCounter();
                        setSlickCounter();
                        sliderNav.on('reInit afterChange', function (event, slick, currentSlide, nextSlide) {
                            var i = (currentSlide ? currentSlide : 0) + 1;
                            sliderNav.find('.slick-counter--current').text(i);
                        });
                    }
                });

                sliderNav.on('reInit', () => {
                    if (window.innerWidth < 768 && navCounterMobi) {
                        if (variant_image_group) getSlickCounter();
                        setSlickCounter();
                    }
                });

                sliderNav.closest('.productView').is('.layout-4') ? checkFor = false : checkFor = sliderFor;

                if(sliderNav.hasClass('productView-nav-gallery')) {
                    var sliderNav2 = $scope.find('.productView-nav.productView-nav-gallery'),
                        length = sliderNav2.data('media-count'),
                        oneItems = sliderNav2.data('1-item-mobi'),
                        show = 2,
                        rows = 2;

                    if (length == 1) {
                      show = 1;
                      rows = 1;
                    }
                    if (length == 2) {
                      show = 2;
                      rows = 1;
                    }

                    if (oneItems && window.innerWidth < 551) {
                        show = 1;
                        rows = 1;
                    }

                    sliderNav2.slick({
                        dots: true,
                        rows: rows,
                        arrows: navArrowsDesk,
                        infinite: true,
                        slidesPerRow: 1,
                        slidesToShow: show,
                        focusOnSelect: false,
                        asNavFor: checkFor,
                        nextArrow: window.arrows.icon_next,
                        prevArrow: window.arrows.icon_prev,
                        rtl: window.rtl_slick,
                        responsive: [
                            {
                                breakpoint: 767,
                                settings: {
                                    arrows: navArrowsMobi
                                }
                            }
                        ]
                    });
                    checkNav = sliderNav2;
                } else if(sliderNav.hasClass('productView-horizontal-tabs')) {
                    var sliderNav2 = $scope.find('.productView-nav.productView-horizontal-tabs'),
                        show = 2,
                        rows = 1;

                    sliderNav2.slick({
                        dots: true,
                        rows: rows,
                        arrows: navArrowsDesk,
                        infinite: false,
                        slidesPerRow: 1,
                        slidesToShow: 2,
                        focusOnSelect: false,
                        asNavFor: checkFor,
                        nextArrow: window.arrows.icon_next,
                        prevArrow: window.arrows.icon_prev,
                        rtl: window.rtl_slick,
                        responsive: [
                            {
                                breakpoint: 767,
                                settings: {
                                    arrows: navArrowsMobi,
                                    get slidesToShow() {
                                        if(sliderNav2.parents('.product-details').hasClass('featured-product')) {
                                            return this.slidesToShow = 1;
                                        } else {
                                            return this.slidesToShow = 2;
                                        }
                                    }
                                }
                            }
                        ]
                    });
                    checkNav = sliderNav2;
                } else {
                    if (!sliderNav.is('.style-2, .style-3') || window.innerWidth < 768) {
                        sliderNav.slick({
                            fade: true,
                            dots: false,
                            arrows: navArrowsDesk,
                            infinite: true,
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            asNavFor: checkFor,
                            nextArrow: window.arrows.icon_next,
                            prevArrow: window.arrows.icon_prev,
                            rtl: window.rtl_slick,
                            responsive: [
                                {
                                    breakpoint: 768,
                                    settings: {
                                        arrows: navArrowsMobi
                                    }
                                }
                            ]
                        }); 
                        checkNav = sliderNav;
                    }
                    else {
                        checkNav = false;
                    }
                }

                if($scope.hasClass('layout-1') || $scope.hasClass('layout-2')){
                    sliderFor.on('init',(event, slick) => {
                        sliderFor.find('.animated-loading').removeClass('animated-loading');
                    });

                    sliderFor.slick({
                        slidesToShow: thumbnailToShow,
                        slidesToScroll: 1,
                        asNavFor: checkNav,
                        arrows: true,
                        dots: false,
                        draggable: false,
                        adaptiveHeight: false,
                        focusOnSelect: true,
                        vertical: true,
                        verticalSwiping: true,
                        infinite: true,
                        nextArrow: window.arrows.icon_next,
                        prevArrow: window.arrows.icon_prev,
                        responsive: [
                            {
                                breakpoint: 1600,
                                settings: {
                                    slidesToShow: thumbnailToShow > 3 ? thumbnailToShow - 1 : thumbnailToShow,
                                    slidesToScroll: 1
                                }
                            },
                            {
                                breakpoint: 1280,
                                settings: {
                                    vertical: false,
                                    verticalSwiping: false,
                                    rtl: window.rtl_slick,
                                }
                            },
                            {
                                breakpoint: 767,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 1,
                                    vertical: false,
                                    verticalSwiping: false,
                                    rtl: window.rtl_slick,
                                }
                            }
                        ]
                    });
                } else if($scope.hasClass('layout-3')){
                    sliderFor.on('init',(event, slick) => {
                        sliderFor.find('.animated-loading').removeClass('animated-loading');
                    });

                    sliderFor.slick({
                        slidesToShow: thumbnailToShow,
                        slidesToScroll: 1,
                        asNavFor: checkNav,
                        arrows: true,
                        dots: false,
                        focusOnSelect: true,
                        infinite: true,
                        nextArrow: window.arrows.icon_next,
                        prevArrow: window.arrows.icon_prev,
                        rtl: window.rtl_slick,
                        responsive: [
                            {
                                breakpoint: 1600,
                                settings: {
                                    slidesToShow: thumbnailToShow > 3 ? thumbnailToShow - 1 : thumbnailToShow,
                                    slidesToScroll: 1
                                }
                            },
                            {
                                breakpoint: 767,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 1
                                }
                            }
                        ]
                    });
                }

                sliderForMobile.on('init',(event, slick) => {
                    sliderForMobile.find('.animated-loading').removeClass('animated-loading');
                });

                sliderForMobile.slick({
                    slidesToShow:  parseInt(sliderForMobile.data('max-thumbnail-to-show')),
                    slidesToScroll: 1,
                    asNavFor: checkNav,
                    arrows: true,
                    dots: false,
                    draggable: false,
                    adaptiveHeight: false,
                    focusOnSelect: true,
                    vertical: true,
                    verticalSwiping: true,
                    infinite: true,
                    nextArrow: window.arrows.icon_next,
                    prevArrow: window.arrows.icon_prev,
                    rtl: window.rtl_slick,
                    responsive: [
                        {
                            breakpoint: 1600,
                            settings: {
                                slidesToShow: thumbnailToShow > 3 ? thumbnailToShow - 1 : thumbnailToShow,
                                slidesToScroll: 1
                            }
                        },
                        {
                            breakpoint: 1280,
                            settings: {
                                vertical: false,
                                verticalSwiping: false
                            }
                        },
                        {
                            breakpoint: 767,
                            settings: {
                                slidesToShow: 2.2,
                                slidesToScroll: 1,
                                vertical: false,
                                verticalSwiping: false
                            }
                        }
                    ]
                });

                if (sliderNav.find('[data-youtube]').length > 0) {
                    if (typeof window.onYouTubeIframeAPIReady === 'undefined') {
                        window.onYouTubeIframeAPIReady = halo.initYoutubeCarousel.bind(window, sliderNav);

                        const tag = document.createElement('script');
                        tag.src = 'https://www.youtube.com/player_api';
                        const firstScriptTag = document.getElementsByTagName('script')[0];
                        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                    } else {
                        halo.initYoutubeCarousel(sliderNav);
                    }
                }

                if (sliderNav.find('[data-vimeo]').length > 0) {
                    sliderNav.on('beforeChange', (event, slick) => {
                        var currentSlide,
                            player,
                            command;

                        currentSlide = $(slick.$slider).find('.slick-current');
                        player = currentSlide.find('iframe').get(0);

                        command = {
                            'method': 'pause',
                            'value': 'true'
                        };

                        if (player != undefined) {
                            player.contentWindow.postMessage(JSON.stringify(command), '*');
                        }
                    });

                    sliderNav.on('afterChange', (event, slick) => {
                        var currentSlide,
                            player,
                            command;

                        currentSlide = $(slick.$slider).find('.slick-current');
                        player = currentSlide.find('iframe').get(0);

                        command = {
                            'method': 'play',
                            'value': 'true'
                        };

                        if (player != undefined) {
                            player.contentWindow.postMessage(JSON.stringify(command), '*');
                        }
                    });
                }

                if (sliderNav.find('[data-mp4]').length > 0) {
                    sliderNav.on('beforeChange', (event, slick) => {
                        var currentSlide,
                            player;

                        currentSlide = $(slick.$slider).find('.slick-current');
                        player = currentSlide.find('video').get(0);

                        if (player != undefined) {
                            player.pause();
                        }
                    });

                    sliderNav.on('afterChange', (event, slick) => {
                        var currentSlide,
                            player;

                        currentSlide = $(slick.$slider).find('.slick-current');
                        player = currentSlide.find('video').get(0);

                        if (player != undefined) {
                            player.play();
                        }
                    });
                }
            }

            var productFancybox = $scope.find('[data-fancybox]');

            if(productFancybox.length > 0){
                productFancybox.fancybox({
                    buttons: [
                        "zoom",
                        "share",
                        "slideShow",
                        "fullScreen",
                        //"download",
                        "thumbs",
                        "close"
                    ],
                    loop : true,
                    thumbs : {
                        autoStart : true,
                    }
                });
            }

            // if($body.hasClass('template-product')) {
                // if ($scope.closest('.quickView').length) return;
                var productZoom = $scope.find('[data-zoom-image]');

                if ($win.width() > 1024) {
                    productZoom.each((index, element) => {
                        var $this = $(element);
                        
                        if ($win.width() > 1024) {
                            $this.zoom({ url: $this.attr('data-zoom-image'), touch: false });
                        } else {
                            $this.trigger('zoom.destroy');
                        }
                    });
                }
            // }

            $win.on('resize', () => {
                if($scope.hasClass('layout-1') || $scope.hasClass('layout-2')){
                    if ($win.width() > 1279) {
                        setTimeout(() => {
                            if (sliderFor.find('.slick-arrow').length > 0) {
                                var height_for = sliderFor.outerHeight(),
                                    height_nav = sliderNav.outerHeight(),
                                    pos = (height_nav - height_for)/2;

                                sliderFor.parent().addClass('arrows-visible');
                                sliderFor.parent().css('top', pos);
                            } else {
                                sliderFor.parent().addClass('arrows-disable');
                            }
                        }, 200);
                    } else {
                        setTimeout(() => {
                            if (sliderFor.find('.slick-arrow').length > 0) {
                                sliderFor.parent().css('top', 'unset');
                            }
                        }, 200);
                    }
                }
            });
        },

        productVideoGallery: function($scope) {
            const videoThumbnail = $scope.find('[data-video-thumbnail]'),
                videoThumbnailLen = videoThumbnail.length,
                productVideoLen = $('.productView-video').length;

            if (videoThumbnailLen) {
                const $imageWrapper = $scope.find('.productView-image-wrapper'),
                    videoModal = $('[data-popup-video]'),
                    sliderNav = $scope.find('.productView-nav');
                let offsetTop = $imageWrapper.offset().top + $imageWrapper.outerHeight();

                if (productVideoLen) {
                    $body.addClass('has-product-video');
                }
                
                $win.on('scroll', (event) => {
                    const $targetCur = $(event.currentTarget),
                        thisVideo = $scope.find('.slick-current .productView-video'),
                        videoType = thisVideo.data('type'),
                        videoUrl = thisVideo.data('video-url');

                    if (videoUrl != undefined) {
                        if ($targetCur.scrollTop() > offsetTop) {
                            if (!videoModal.is('.is-show')) {
                                const player = sliderNav.find('.slick-slide.slick-active').data('youtube-player'),
                                    dataTime = parseInt(player.getCurrentTime()),
                                    videoContent = `<div class="fluid-width-video-wrapper" style="padding-top: 56.24999999999999%">
                                                    ${videoType == 'youtube' ? 
                                                        `<iframe
                                                            id="player"
                                                            type="text/html"
                                                            width="100%"
                                                            frameborder="0"
                                                            webkitAllowFullScreen
                                                            mozallowfullscreen
                                                            allowFullScreen
                                                            src="https://www.youtube.com/embed/${videoUrl}?autoplay=1&mute=1&start=${dataTime}">
                                                        </iframe>`
                                                        :
                                                        `<iframe 
                                                            src="https://player.vimeo.com/video/${videoUrl}?autoplay=1&mute=1" 
                                                            class="js-vimeo" 
                                                            allow="autoplay; 
                                                            encrypted-media" 
                                                            webkitallowfullscreen 
                                                            mozallowfullscreen 
                                                            allowfullscreen">
                                                        </iframe>`
                                                    }
                                                </div>`;
                                videoModal.addClass('is-show');
                                videoModal.find('.halo-popup-content').html(videoContent);
                                $body.addClass('video-show product-video-show');
                                player.pauseVideo();
                            }
                        } else {
                            const player = sliderNav.find('.slick-slide.slick-active').data('youtube-player');
                            videoModal.removeClass('is-show');
                            videoModal.find('.halo-popup-content').empty();
                            $body.removeClass('video-show product-video-show');
                            player.playVideo();
                        }
                    }
                });
            }
        },

        initVariantImageGroup: function($scope, enable = false) {
            if(enable){
                var inputChecked = $scope.find('[data-filter]:checked'),
                sliderFor = $scope.find('.productView-for'),
                sliderNav = $scope.find('.productView-nav'),
                productOption = $scope.find('.productView-product .productView-options'),
                metafields = $scope.find('[data-filter]:checked').data('metafields-vig'),
                pageLayout;

                switch (true) {
                    case sliderNav.hasClass('productView-nav-gallery'):
                        pageLayout = 'gallery';
                        break;
                    case sliderNav.closest('.product-full-width').length == 1 || sliderNav.closest('.product-full-width-2').length == 1:
                        pageLayout = 'full-width';
                        break;
                    default:
                        pageLayout = 'default';
                }

                const unFilter = () => {
                    sliderFor.slick('slickUnfilter');
                    if (pageLayout == 'full-width' && window.innerWidth > 767) return;
                    if (sliderNav.hasClass('slick-filter')) sliderNav.find('.slick-counter').remove();
                    sliderNav.slick('slickUnfilter').removeClass('slick-filter');
                }

                const filter = (list) => {
                    switch (pageLayout) {
                        case 'gallery':
                            sliderNav
                                .slick('unslick')
                                .empty()
                                .html(sliderNavHTML)
                                .find('.productView-image').each(function() {
                                    if (!$(this).is(list)) $(this).remove();
                                });

                            const navArrowsDesk = sliderNav.data('arrows-desk'),
                                navArrowsMobi = sliderNav.data('arrows-mobi'),
                                length = sliderNav.data('media-count'),
                                oneItems = sliderNav.data('1-item-mobi'),
                                show = 2,
                                rows = 2;

                            if (length == 1) {
                                show = 1;
                                rows = 1;
                            }

                            if (length == 2) {
                                show = 2;
                                rows = 1;
                            }

                            if (oneItems && window.innerWidth < 551) {
                                show = 1;
                                rows = 1;
                            }

                            sliderNav.slick({
                                dots: true,
                                rows: rows,
                                arrows: navArrowsDesk,
                                infinite: true,
                                slidesPerRow: 1,
                                slidesToShow: show,
                                focusOnSelect: false,
                                asNavFor: sliderFor,
                                nextArrow: window.arrows.icon_next,
                                prevArrow: window.arrows.icon_prev,
                                rtl: window.rtl_slick,
                                responsive: [
                                    {
                                        breakpoint: 767,
                                        settings: {
                                            arrows: navArrowsMobi
                                        }
                                    }
                                ]
                            });
                            if ($('.cursor-wrapper').length) halo.productCustomCursor($('.halo-productView'));
                            break;
                        case 'full-width':
                            if (window.innerWidth > 767) {
                                let dataIndex = 1, checkList = 0;

                                sliderNav
                                    .empty()
                                    .html(sliderNavHTML);

                                if (sliderNavHTML.length) {
                                    list.split(',').forEach(element => {if (sliderNavHTML.includes(element.replace(/\./g,''))) checkList++});
                                    if (checkList == 0) {
                                        sliderNav.removeClass('media-filter');
                                    } else {
                                        sliderNav.addClass('media-filter');
                                        sliderNav.find('.productView-image').each(function() {
                                            if (!$(this).is(list)) {
                                                $(this).remove();
                                            } else {
                                                $(this).attr('data-index', dataIndex);
                                                $(this).find('img').attr('data-index', dataIndex);
                                                dataIndex++;
                                            }
                                        });
                                    }
                                }

                                if ($('.cursor-wrapper').length) {
                                    $('.cursor-wrapper .counter-total').text(sliderNav.find('.productView-image').length);
                                    halo.productCustomCursor($('.halo-productView'));
                                }
                            }
                            break;
                        default:
                            sliderNav
                                .slick('slickFilter', list)
                                .slick('refresh')
                                .addClass('slick-filter');
                    }
                    if (sliderFor) sliderFor.slick('slickFilter', list).slick('refresh');
                }

                const setImageForMetafields = (list, unfilter) => {
                    let array = list.split(','),
                        slidesToKeep = [];
                    
                    array.forEach(element => {
                        slidesToKeep.push(`.filter-${element.toLowerCase().replace(/[^A-Z0-9]/ig, '-')}`);
                    });
                    
                    if (unfilter) unFilter();
                    filter(slidesToKeep.join(','));
                }

                const setImage = (className, input) => {
                    if (productOption.data('lang') != productOption.data('default-lang') && input.data('value-default-lang')) className = `.filter-${input.data('value-default-lang')}`;
                    unFilter();
                    if(className !== undefined) {
                        if (sliderNav.find(className).length || sliderFor.find(className).length || pageLayout == 'full-width') filter(className);
                    }
                }

                if(inputChecked.length > 0) {
                    let className = inputChecked.data('filter');
                    metafields && metafields.length ? setImageForMetafields(metafields, false) : setImage(className, inputChecked);
                }

                $doc.on('change', 'input[data-filter]', (event) => {
                    let className = $(event.currentTarget).data('filter'),
                    thisMetafields = $(event.currentTarget).data('metafields-vig');
                    thisMetafields && thisMetafields.length ? setImageForMetafields(thisMetafields, true) : setImage(className, $(event.currentTarget));
                });
            }
        },

        initYoutubeCarousel: function(slider) {
            slider.each((index, slick) => {
                const $slick = $(slick);

                if ($slick.find('[data-youtube]').length > 0) {
                    $slick.addClass('slick-slider--video');

                    halo.initYoutubeCarouselEvent(slick);
                }
            });
        },

        initYoutubeCarouselEvent: function(slick){
            var $slick = $(slick),
                $videos = $slick.find('[data-youtube]');

            bindEvents(slick);

            function bindEvents() {
                if ($slick.hasClass('slick-initialized')) {
                    onSlickImageInit($slick, $videos);
                }

                $doc.on('init', $slick, onSlickImageInit);
                $doc.on('beforeChange', $slick, onSlickImageBeforeChange);
                $doc.on('afterChange', $slick, onSlickImageAfterChange);
            }

            function onPlayerReady(event) {
                $(event.target.getIframe()).closest('.slick-slide').data('youtube-player', event.target);

                setTimeout(function(){
                    if ($(event.target.getIframe()).closest('.slick-slide').hasClass('slick-active')) {
                        $slick.slick('slickPause');
                        event.target.playVideo();
                    }
                }, 200);
            }

            function onPlayerStateChange(event) {
                if (event.data === YT.PlayerState.PLAYING) {
                    $slick.slick('slickPause');
                }

                if (event.data === YT.PlayerState.ENDED) {
                    $slick.slick('slickNext');
                }
            }

            function onSlickImageInit() {
                $videos.each((j, vid) => {
                    const $vid = $(vid);
                    const id = `youtube_player_${Math.floor(Math.random() * 100)}`;

                    $vid.attr('id', id);

                    const player = new YT.Player(id, {
                        host: 'http://www.youtube.com',
                        videoId: $vid.data('youtube'),
                        wmode: 'transparent',
                        playerVars: {
                            autoplay: 0,
                            controls: 0,
                            disablekb: 1,
                            enablejsapi: 1,
                            fs: 0,
                            rel: 0,
                            showinfo: 0,
                            iv_load_policy: 3,
                            modestbranding: 1,
                            wmode: 'transparent',
                        },
                        events: {
                            onReady: onPlayerReady,
                            onStateChange: onPlayerStateChange,
                        },
                    });
                });
            }

            function onSlickImageBeforeChange(){
                const player = $slick.find('.slick-slide.slick-active').data('youtube-player');

                if (player) {
                    player.stopVideo();
                    $slick.removeClass('slick-slider--playvideo');
                }
            }

            function onSlickImageAfterChange(){
                const player = $slick.find('.slick-slide.slick-active').data('youtube-player');

                if (player) {
                    $slick.slick('slickPause');
                    $slick.addClass('slick-slider--playvideo');
                    player.playVideo();
                }
            }
        },

        productSizeChart: function($scope){
            window.sizeChart = function() {
                var sizeChartBtn =  $scope.find('[data-open-size-chart-popup]');

                sizeChartBtn.on('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    document.body.classList.add('size-chart-show');
                    if (document.body.classList.contains('quick-view-show')) {
                        $('.halo-popup-content .halo-size-chart-popup').addClass('is-show');
                    }
                    else {
                        $('#MainContent .halo-size-chart-popup').addClass('is-show');
                    }
                });

                $doc.on('click', '[data-close-size-chart-popup]', () => {
                    $body.removeClass('size-chart-show');
                    $('.halo-size-chart-popup').removeClass('is-show');
                });

                $doc.on('click', (event) => {
                    if ($body.hasClass('size-chart-show')) {
                        if (($(event.target).closest('[data-open-size-chart-popup]').length === 0) && ($(event.target).closest('[data-size-chart-popup]').length === 0)) {
                            $body.removeClass('size-chart-show');
                        }
                    }
                });
            };

            var quickViewShow = document.body.classList.contains('quick-view-show'),
                productSizeChart = $('.halo-productView .productView-sizeChart').length;

            if (document.body.classList.contains('template-product')) {
                if (!quickViewShow && productSizeChart) {
                    window.sizeChart();
                } else if (quickViewShow && productSizeChart === 0) {
                    window.sizeChart();
                }
            } else {
                window.sizeChart();
            }
        },

        productLastSoldOut: function($scope) {
            var wrapper = $scope.find('[data-sold-out-product]');

            if (wrapper.length > 0) {
                var numbersProductList = wrapper.data('item').toString().split(','),
                    numbersProductItem = Math.floor(Math.random() * numbersProductList.length),
                    numbersHoursList = wrapper.data('hours').toString().split(','),
                    numbersHoursItem = Math.floor(Math.random() * numbersHoursList.length);

                wrapper.find('[data-sold-out-number]').text(numbersProductList[numbersProductItem]);
                wrapper.find('[data-sold-out-hours]').text(numbersHoursList[numbersHoursItem]);
                wrapper.show();
            }
        },

        productCustomerViewing: function($scope) {
            var wrapper = $scope.find('[data-customer-view]');

            if (wrapper.length > 0) {
                var numbersViewer = wrapper.data('customer-view'),
                    numbersViewerList =  JSON.parse('[' + numbersViewer + ']'),
                    numbersViewerTime = wrapper.data('customer-view-time'),
                    timeViewer =  parseInt(numbersViewerTime) * 1000;
                
                setInterval(function() {
                    var numbersViewerItem = (Math.floor(Math.random() * numbersViewerList.length));

                    wrapper.find('.text').text(window.customer_view.text.replace('[number]', numbersViewerList[numbersViewerItem]));
                }, timeViewer);
            }
        },

        productCountdown: function($scope){
            var wrapper = $scope.find('[data-countdown-id]'),
                countDown = wrapper.data('countdown'),
                countDownDate = new Date(countDown).getTime(),
                countDownText = window.countdown.text;

            if(wrapper.length > 0) {
                var countdownfunction = setInterval(function() {
                    var now = new Date().getTime(),
                        distance = countDownDate - now;

                    if (distance < 0) {
                        clearInterval(countdownfunction);
                        wrapper.remove();
                    } else {
                        var days = Math.floor(distance / (1000 * 60 * 60 * 24)),
                            hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                            minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                            seconds = Math.floor((distance % (1000 * 60)) / 1000),
                            strCountDown;

                        if (wrapper.is('.style-2, .style-3, .style-4')) {
                            strCountDown = '<span class="text"><span>'+ countDownText +'</span></span><span class="num">'+days+'<span>'+ window.countdown.day_2 +'</span></span>\
                                <span class="num">'+hours+'<span>'+ window.countdown.hour_2 +'</span></span>\
                                <span class="num">'+minutes+'<span>'+ window.countdown.min_2 +'</span></span>\
                                <span class="num">'+seconds+'<span>'+ window.countdown.sec_2 +'</span></span>';
                        }
                        else {
                            strCountDown = '<span class="text"><span>'+ countDownText +'</span></span><span class="num">'+days+'<span>'+ window.countdown.day +'</span></span>\
                                <span class="num">'+hours+'<span>'+ window.countdown.hour +'</span></span>\
                                <span class="num">'+minutes+'<span>'+ window.countdown.min +'</span></span>\
                                <span class="num">'+seconds+'<span>'+ window.countdown.sec +'</span></span>';
                        }

                        wrapper.html(strCountDown);
                        wrapper.addClass('show');
                    }
                }, 1000);
            }
        },

        productCustomCursor: function($scope){
            if ($('.cursor-wrapper').length == 0) return;
            const { Back } = window;

            this.cursorWrapper = document.querySelector(".cursor-wrapper");
            this.innerCursor = document.querySelector(".custom-cursor__inner");
            this.outerCursor = document.querySelector(".custom-cursor__outer");

            this.cursorWrapperBox = this.cursorWrapper.getBoundingClientRect();
            this.innerCursorBox = this.innerCursor.getBoundingClientRect();
            this.outerCursorBox = this.outerCursor.getBoundingClientRect();

            document.addEventListener("mousemove", e => {
                this.clientX = e.clientX;
                this.clientY = e.clientY;
            });

            const render = () => {
                TweenMax.set(this.cursorWrapper, {
                    x: this.clientX,
                    y: this.clientY
                });
                requestAnimationFrame(render);
            };
            requestAnimationFrame(render);

            this.fullCursorSize = 60;
            this.enlargeCursorTween = TweenMax.to(this.outerCursor, 0.3, {
                width: this.fullCursorSize,
                height: this.fullCursorSize,
                ease: this.easing,
                paused: true
            });

            const handleMouseEnter = () => {
                this.enlargeCursorTween.play();
                $('.cursor-wrapper').addClass('handleMouseEnter').removeClass('handleMouseLeave');
            };

            const handleMouseLeave = () => {
                this.enlargeCursorTween.reverse();
                $('.cursor-wrapper').addClass('handleMouseLeave').removeClass('handleMouseEnter');
            };

            const gridItems = document.querySelectorAll(".productView-image");
            gridItems.forEach(el => {
                if (el?.querySelector('.productView-video')) return;
                el.addEventListener("mouseenter", handleMouseEnter);
                el.addEventListener("mouseleave", handleMouseLeave);
            });

            this.bumpCursorTween = TweenMax.to(this.outerCursor, 0.1, {
                scale: 0.7,
                paused: true,
                onComplete: () => {
                    TweenMax.to(this.outerCursor, 0.2, {
                        scale: 1,
                        ease: this.easing
                    });
                }
            });

            $(document).on('mouseover', '[data-cursor-image]', (event) => {
                var $target = $(event.currentTarget),
                    imagesInView = new Array();

                imagesInView.push($target.attr('data-index'));
                $("#count-image").text(imagesInView[0]);
            });

            $.fn.isInViewport = function(excludePartials) {
                var elementTop = $(this).offset().top;
                var elementBottom = elementTop + $(this).height();

                var viewportTop = $(document).scrollTop();
                var viewportBottom = viewportTop + $(window).height();

                if (excludePartials) {
                    var bottomVisible = (elementBottom - viewportTop) / $(this).height();
                    var isInView = elementBottom > viewportTop && elementTop < viewportBottom;

                    return isInView && bottomVisible > 0.5;
                }

                return elementBottom > viewportTop && elementTop < viewportBottom;
            };

            
            if ($('.product-full-width').length > 0 || $('.product-full-width-2').length > 0) {
                $(window).on('resize scroll', function() {
                    var imagesInView = new Array();
                    $('.productView-image').each(function() {
                        if ($(this).isInViewport(true)) {
                            imagesInView.push($(this).attr('data-index'));
                            $("#count-image").text(imagesInView[0]);
                        }
                    });
                });
            }
        },

        initWishlist: function() {
            if(window.wishlist.show){
                halo.setLocalStorageProductForWishlist();

                $doc.on('click', '[data-wishlist]', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    if (!$(event.currentTarget).hasClass('is-in-grid')) {
                        $('[data-wishlist-items-display]').removeClass('is-loaded');
                    }

                    var $target = $(event.currentTarget),
                        id = $target.data('product-id'),
                        handle = $target.data('wishlist-handle'),
                        wishlistList = localStorage.getItem('wishlistItem') ? JSON.parse(localStorage.getItem('wishlistItem')) : [];
                        index = wishlistList.indexOf(handle),
                        wishlistContainer = $('[data-wishlist-container]');
                        wishlistLayout = wishlistContainer.attr('data-wishlist-layout');

                    if(!$target.hasClass('wishlist-added')){
                        $target
                            .addClass('wishlist-added')
                            .find('.text')
                            .text(window.wishlist.added);

                        if(wishlistContainer.length > 0) {
                            const addEvent = new CustomEvent('addwishlistitem', { detail: { handle } , bubbles: true });
                            document.dispatchEvent(addEvent);
                        }

                        wishlistList.push(handle);
                        localStorage.setItem('wishlistItem', JSON.stringify(wishlistList));
                        
                        const updateWishlistMailEvent = new CustomEvent('updatewishlistmail', { bubbles: true });
                        document.dispatchEvent(updateWishlistMailEvent); 
                    } else {
                        $target
                            .removeClass('wishlist-added')
                            .find('.text')
                            .text(window.wishlist.add);
                        if(wishlistContainer.length > 0) {
                            if($('[data-wishlist-added="wishlist-'+ id +'"]').length > 0) {
                                $('[data-wishlist-added="wishlist-'+ id +'"]').remove();
                                const icon = $(`[data-wishlist][data-product-id=${id}]`);
                                const productCard = icon.closest('.product');
                                productCard.remove();
                            }           
                        }

                        wishlistList.splice(index, 1);
                        localStorage.setItem('wishlistItem', JSON.stringify(wishlistList));

                        const updatePaginationEvent = new CustomEvent('updatepagination', { bubbles: true })
                        document.dispatchEvent(updatePaginationEvent);
                        
                        if(wishlistContainer.length > 0) {
                            wishlistList = localStorage.getItem('wishlistItem') ? JSON.parse(localStorage.getItem('wishlistItem')) : [];

                            if (wishlistList.length > 0) {
                                const updateWishlistMailEvent = new Event('updatewishlistmail', { bubbles: true })
                                document.dispatchEvent(updateWishlistMailEvent);
                            } else {
                                $('[data-wishlist-container]')
                                    .addClass('is-empty')
                                    .html(`\
                                    <div class="wishlist-content-empty text-center">\
                                        <span class="wishlist-content-text">${window.wishlist.empty}</span>\
                                        <div class="wishlist-content-actions">\
                                            <a class="button button-2 button-continue" href="${window.routes.collection_all}">\
                                                ${window.wishlist.continue_shopping}\
                                            </a>\
                                        </div>\
                                    </div>\
                                `);

                                $('[data-wishlist-footer]').hide();
                            }   
                        }
                    }
                    $('[data-wishlist-count]').text(wishlistList.length);
                    halo.setProductForWishlist(handle);
                })
            }
        },

        calculateCard06Padding() {
            if (!$body.hasClass('product-card-layout-06')) return 

            const cardAction = document.querySelector('.card .card-action.card-grid__hidden');
            cardAction.classList.remove('card-grid__hidden');
            const padding = cardAction.scrollHeight;

            document.querySelector('[data-wishlist-items-grid-display]').style.setProperty('--card-06-padding', padding + 'px');
            cardAction.classList.add('card-grid__hidden');
        },

        setProductForWishlist: function(handle){
            var wishlistList = JSON.parse(localStorage.getItem('wishlistItem')),
                item = $('[data-wishlist-handle="'+ handle +'"]'),
                index = wishlistList?.indexOf(handle);

            if (index == null || wishlistList == null) return;
            
            if(index >= 0) {
                item
                    .addClass('wishlist-added')
                    .find('.text')
                    .text(window.wishlist.added)
            } else {
                item
                    .removeClass('wishlist-added')
                    .find('.text')
                    .text(window.wishlist.add);
            }
        },

        setLocalStorageProductForWishlist: function() {
            var wishlistList = localStorage.getItem('wishlistItem') ? JSON.parse(localStorage.getItem('wishlistItem')) : [];
            localStorage.setItem('wishlistItem', JSON.stringify(wishlistList));

            if (wishlistList.length > 0) {
                wishlistList = JSON.parse(localStorage.getItem('wishlistItem'));
                
                wishlistList.forEach((handle) => {
                    halo.setProductForWishlist(handle);
                });
            }
            $('[data-wishlist-count]').text(wishlistList.length);
        },

        initCountdown: function () {
          var countdownAnnouncementElm = $('[data-countdown-announcement]'),
              countdownElm = $('[data-countdown]').not('[data-countdown-id]'),
              countdownNewsletter = $('[data-countdown-time]');

            if (countdownAnnouncementElm.length) {
                countdownAnnouncementElm.each(function () {
                    var self = $(this),
                        countdownAnnouncement = self.data('countdown-value'),
                        countdownAnnouncementDate = new Date(countdownAnnouncement).getTime();

                    var countdownAnnouncementFunction = setInterval(function() {
                        var now = new Date().getTime(),
                            distance = countdownAnnouncementDate - now;

                        if (distance < 0) {
                            clearInterval(countdownAnnouncementFunction);
                            if (self.hasClass('hide--countdown')) {
                                self.remove();
                            }
                            else {
                                const thisItem = self.parents('.announcement-bar__message'),
                                    thisBar = self.parents('[data-announcement-bar]');
                                thisBar.is('.slick-initialized') ? thisBar.slick('slickRemove', thisItem.data('slick-index')) : thisItem.remove();
                            }
                        } else {
                             var days = Math.floor(distance / (1000 * 60 * 60 * 24)),
                                hours = `0${Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}`.slice(-2),
                                minutes = `0${Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))}`.slice(-2),
                                seconds = `0${Math.floor((distance % (1000 * 60)) / 1000)}`.slice(-2),
                                strCountDown = '';
                            
                            strCountDown = '<div class="clock-item"><span class="num">'+days+'</span><span class="text">'+ window.countdown.days +'</span></div>\
                                            <div class="clock-item"><span class="num">'+hours+'</span><span class="text">'+ window.countdown.hours +'</span></div>\
                                            <div class="clock-item"><span class="num">'+minutes+'</span><span class="text">'+ window.countdown.mins +'</span></div>\
                                            <div class="clock-item"><span class="num">'+seconds+'</span><span class="text">'+ window.countdown.secs +'</span></div>';
                          
                            self.html(strCountDown);
                        }
                    }, 1000);
                });
            }

            if (countdownElm.length) {
                countdownElm.each(function () {
                    var self = $(this),
                        countDown = self.data('countdown-value'),
                        countDownDate = new Date(countDown).getTime();
                        
                    var countdownfunction = setInterval(function() {
                        var now = new Date().getTime(),
                            distance = countDownDate - now;

                        if (distance < 0) {
                            clearInterval(countdownfunction);
                            if (self.hasClass('hide--countdown')) {
                                self.remove();
                            }
                            else {
                                self.parents('.shopify-section').remove();
                            }
                        } else {
                            var days = Math.floor(distance / (1000 * 60 * 60 * 24)),
                                hours = `0${Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}`.slice(-2),
                                minutes = `0${Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))}`.slice(-2),
                                seconds = `0${Math.floor((distance % (1000 * 60)) / 1000)}`.slice(-2),
                                strCountDown = '';
                            if (self.hasClass('product-countdown-block')) {
                                if($('.halo-block-header').hasClass('countdown_style_2')){
                                    strCountDown = '<div class="clock-item"><span class="num">'+days+ window.countdown.d +'</span><span class="icon">:</span></div>\
                                                <div class="clock-item"><span class="num">'+hours+ window.countdown.h +'</span><span class="icon">:</span></div>\
                                                <div class="clock-item"><span class="num">'+minutes+ window.countdown.m +'</span><span class="icon">:</span></div>\
                                                <div class="clock-item"><span class="num">'+seconds+ window.countdown.s +'</span><span class="icon"></span></div>';
                                } else{
                                    strCountDown = `<div class="clock-item"><span class="num">${days}d&nbsp;</span></div>
                                    <div class="clock-item"><span class="num">${hours}:</span></div>
                                    <div class="clock-item"><span class="num">${minutes}:</span></div>
                                    <div class="clock-item"><span class="num">${seconds}</span></div>`;
                                }
                            } else {
                                strCountDown = '<div class="clock-item"><span class="num">'+days+'</span><span class="text">'+ window.countdown.days +'</span></div>\
                                                <div class="clock-item"><span class="num">'+hours+'</span><span class="text">'+ window.countdown.hours +'</span></div>\
                                                <div class="clock-item"><span class="num">'+minutes+'</span><span class="text">'+ window.countdown.mins +'</span></div>\
                                                <div class="clock-item"><span class="num">'+seconds+'</span><span class="text">'+ window.countdown.secs +'</span></div>';
                            }
                            self.html(strCountDown);
                        }
                    }, 1000);
                });
            }

            if (countdownNewsletter.length){
                function initCountdown(element) {
                    const $element = $(element);
                    const countdownTime = new Date($element.data('countdown-time')).getTime();
                
                    const intervalId = setInterval(function() {
                      const now = new Date().getTime();
                      const distance = countdownTime - now;
                
                      if (distance < 0) {
                        clearInterval(intervalId);
                        $element.remove();
                      } else {
                        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                        const content = `
                          <span class="item pos-relative d-inline-block v-a-top left w-auto">
                            <span class="num dis-i-block">${days}</span>
                            <span class="dis-block text uppercase">${window.countdown.day}ays</span>
                          </span>
                          <span class="item pos-relative d-inline-block v-a-top left w-auto">
                            <span class="num dis-i-block">${hours}</span>
                            <span class="dis-block text uppercase">${window.countdown.hour}ours</span>
                          </span>
                          <span class="item pos-relative d-inline-block v-a-top left w-auto">
                            <span class="num dis-i-block">${minutes}</span>
                            <span class="dis-block text uppercase">${window.countdown.min}ins</span>
                          </span>
                          <span class="item pos-relative d-inline-block v-a-top left w-auto">
                            <span class="num dis-i-block">${seconds}</span>
                            <span class="dis-block text uppercase">${window.countdown.sec}econds</span>
                          </span>`;
                
                        $element.find('.countdown').html(content);
                        $element.parent().removeClass('hidden');
                        $element.find('.countdown').addClass('show');
                      }
                    }, 1000);
                }
                
                countdownNewsletter.each(function() {
                    initCountdown(this);
                });
            }
        },

        collectionCountdown: function () {
            var countdownElm = $('[data-collection-countdown]');

            if (countdownElm.length) {
                countdownElm.each(function () {
                    var self = $(this);

                    var countDownCollection = (self) => {
                        var countDown = self.data('collection-countdown-value'),
                            countDownDate = new Date(countDown).getTime(),
                            countDownText = window.countdown.text,
                            now = new Date().getTime(),
                            distance = countDownDate - now;

                        if (distance < 0) {
                            clearInterval(countDownCollection);
                            if (self.hasClass('hide--countdown')) {
                                self.remove();
                            }
                        } else {
                            var days = Math.floor(distance / (1000 * 60 * 60 * 24)),
                                hours = `0${Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}`.slice(-2),
                                minutes = `0${Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))}`.slice(-2),
                                seconds = `0${Math.floor((distance % (1000 * 60)) / 1000)}`.slice(-2),
                                strCountDown = '';
                            if (self.hasClass('collection-countdown')) {
                                strCountDown = '<div class="clock-item"><span class="num">'+days+'</span><span class="text">'+ window.countdown.days +'</span></div>\
                                                <div class="clock-item"><span class="num">'+hours+'</span><span class="text">'+ window.countdown.hours +'</span></div>\
                                                <div class="clock-item"><span class="num">'+minutes+'</span><span class="text">'+ window.countdown.mins +'</span></div>\
                                                <div class="clock-item"><span class="num">'+seconds+'</span><span class="text">'+ window.countdown.secs +'</span></div>';
                            }
                            self.html(strCountDown);
                        }
                    }

                    setInterval(() =>{
                        countDownCollection(self)
                    }, 1000);
                });
            }
        },

        handleScrollDown: function() {
            var iconSrollDownSlt = '[data-scroll-down]',
                iconSrollDown = $(iconSrollDownSlt);

            if (iconSrollDownSlt.length) {
                iconSrollDown.each(function() {
                    var self = $(this);
                    var target = self.closest('.shopify-section').next('.shopify-section').attr('id');

                    self.attr('href', '#'+ target +'');

                    iconSrollDown.on('click', function(e) {
                        e.preventDefault();
                        var scroll = $(this.getAttribute('href'));

                        if (scroll.length) {
                            $('html, body').stop().animate({
                                scrollTop: scroll.offset().top
                            }, 400);
                        };
                    });
                });
            }
        },

        toggleSidebarMobile: function() {
            $doc.on('click', '[data-sidebar]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                $body.addClass('open-mobile-sidebar');
              
            });

            $doc.on('click', '[data-close-sidebar]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                $body.removeClass('open-mobile-sidebar');
            });

            $doc.on('click', (event) => {
                if($body.hasClass('open-mobile-sidebar')){
                    if (($(event.target).closest('[data-sidebar]').length === 0) && ($(event.target).closest('#halo-sidebar').length === 0)) {
                        $body.removeClass('open-mobile-sidebar');
                    }
                }
            });
        },

        initBlogMasonry: function() {
            const $blogMasonry = $('.blog-layout-masonry .blog-block-item');
            const isRTL = $body.hasClass('layout_rtl');

            $blogMasonry.masonry({
                columnWidth: '.blog-grid-sizer',
                itemSelector: '[data-masonry-item]',
                isRTL: isRTL,
                originLeft: !isRTL
            });
        },

        articleGallery: function() {
            const $gallery = $('.articleGallery-block'),
                $gallerySlider = $('.articleGallery-slider'),
                galleryLength = $gallery.length,
                col = $gallerySlider.data('col');

            if (galleryLength > 0 && $gallerySlider.not('.slick-initialized')) {
                $gallerySlider.slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                    arrows: true,
                    infinite: false,
                    mobileFirst: true,
                    focusOnSelect: false,
                    nextArrow: window.arrows.icon_next,
                    prevArrow: window.arrows.icon_prev,
                    rtl: window.rtl_slick,
                    responsive: [
                        {
                            breakpoint: 767,
                            settings: {
                                slidesToShow: col,
                                slidesToScroll: col
                            }
                        },
                        {
                            breakpoint: 319,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 2
                            }
                        }
                    ]
                });
            }
        },

        initCollapseSidebarBlock: function () {
            $doc.on('click', '.sidebarBlock-headingWrapper .sidebarBlock-heading', (event) => {
                var $target = $(event.currentTarget),
                    $blockCollapse = $target.parent().siblings(),
                    $sidebarBlock = $target.parents('.sidebarBlock');

                if ($target.hasClass('is-clicked')) {
                    $target.removeClass('is-clicked');
                    $blockCollapse.slideUp('slow');
                } else {
                    $target.addClass('is-clicked');
                    $blockCollapse.slideDown('slow');

                    if ($sidebarBlock.hasClass('sidebar-product')) {
                        $sidebarBlock.find('.products-carousel').slick('refresh');
                    }
                }
            });

            $doc.on('click', '.sidebarBlock-headingWrapper-slide .sidebarBlock-heading', (event) => {
                var $target = $(event.currentTarget),
                    $wrapBlock = $target.closest(".halo-sidebar-wrapper"),
                    $blockSlide = $target.parent().siblings(),
                    $backButton = $blockSlide.find(".sidebarBlock-slide__content-close"),
                    $sidebarBlock = $target.parents('.sidebarBlock');

                $blockSlide.toggleClass("is-show")
                $wrapBlock.toggleClass("disable-scroll")
                $sidebarBlock.toggleClass("has-slide")

                $backButton.on("click", function () {
                    $blockSlide.removeClass("is-show")
                    $wrapBlock.removeClass("disable-scroll")
                    $sidebarBlock.removeClass("has-slide")
                })
            });
        },

        initCategoryActive: function(){
            if ($('.all-categories-list').length > 0) {
                $doc.on('click', '.all-categories-list .icon-dropdown', (event) => {
                    var $target = $(event.currentTarget).parent();

                    $target.siblings().removeClass('is-clicked current-cate');
                    $target.toggleClass('is-clicked');
                    $target.siblings().find('> .dropdown-category-list').slideUp('slow');
                    $target.find('> .dropdown-category-list').slideToggle('slow');
                });

                $('.all-categories-list li').each((index, element) =>{
                    if ($(element).hasClass('current-cate')) {
                        $(element).find('> .dropdown-category-list').slideToggle('slow');
                    }
                    if ($(element).hasClass("is-clicked")) {
                        $(element).closest(".navPages-item").addClass("is-clicked");
                        $(element).parent().slideDown("slow");
                    }
                });
            }
        },

        productBlockSilderSidebar: function() {
            var productGrid = $('[data-product-slider-sidebar]'),
                itemToShow = productGrid.data('item-to-show'),
                itemDots = productGrid.data('item-dots'),
                itemArrows = productGrid.data('item-arrows');

            if(productGrid.length > 0) {
                if(productGrid.not('.slick-initialized')) {
                    productGrid.slick({
                        mobileFirst: true,
                        adaptiveHeight: true,
                        vertical: false,
                        infinite: false,
                        slidesToShow: itemToShow,
                        slidesToScroll: 1,
                        arrows: itemArrows,
                        dots: itemDots,
                        autoplay: true,
                        autoplaySpeed: 2000,
                        nextArrow: window.arrows.icon_next,
                        prevArrow: window.arrows.icon_prev,
                        rtl: window.rtl_slick,
                    });

                  
                }
            }

            if ($('body').hasClass('cursor-fixed__show')){
                window.sharedFunctionsAnimation.onEnterButton();
                window.sharedFunctionsAnimation.onLeaveButton();
            }
        },

        productBlockSilderArticle: function() {
            var productGrid = $('[data-product-slider-article]'),
                itemToShow = productGrid.data('item-to-show'),
                itemDots = productGrid.data('item-dots'),
                itemArrows = productGrid.data('item-arrows');

            if(productGrid.length > 0) {
                if(productGrid.not('.slick-initialized')) {
                    productGrid.slick({
                        adaptiveHeight: true,
                        vertical: false,
                        infinite: false,
                        slidesToShow: itemToShow,
                        slidesToScroll: 1,
                        arrows: itemArrows,
                        dots: itemDots,
                        nextArrow: window.arrows.icon_next,
                        prevArrow: window.arrows.icon_prev,
                        rtl: window.rtl_slick,
                        responsive: [{
                                breakpoint: 992,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 1,
                                }
                            },
                            {
                                breakpoint: 551,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 1,
                                }
                            }
                        ]
                    });
                }
            }
        },

        articleGallery: function() {
            const $gallery = $('.articleGallery-block'),
                $gallerySlider = $('.articleGallery-slider'),
                galleryLength = $gallery.length,
                col = $gallerySlider.data('col');

            if (galleryLength > 0 && $gallerySlider.not('.slick-initialized')) {
                $gallerySlider.slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                    arrows: true,
                    infinite: false,
                    mobileFirst: true,
                    focusOnSelect: false,
                    nextArrow: window.arrows.icon_next,
                    prevArrow: window.arrows.icon_prev,
                    rtl: window.rtl_slick,
                    responsive: [
                        {
                            breakpoint: 767,
                            settings: {
                                slidesToShow: col,
                                slidesToScroll: col
                            }
                        },
                        {
                            breakpoint: 319,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 2
                            }
                        }
                    ]
                });
            }
        },

        initInfiniteScrolling: function(){
            if ($('.pagination-infinite'.length > 0)) {
                $win.on('scroll load', () => {
                    var currentScroll = $win.scrollTop(),
                        pageInfinite = $('.pagination-infinite'),
                        linkInfinite = pageInfinite.find('[data-infinite-scrolling]'),
                        position; 

                    if(linkInfinite.length > 0 && !linkInfinite.hasClass('is-loading')){
                        position = pageInfinite.offset().top - 500;
                        
                        if (currentScroll > position) {
                            var url = linkInfinite.attr('href');

                            halo.doAjaxInfiniteScrollingGetContent(url, linkInfinite);
                        }
                    }
                });
            }

            $doc.on('click', '[data-infinite-scrolling]', (event) => {
                var linkInfinite = $(event.currentTarget),
                    url = linkInfinite.attr('href');

                event.preventDefault();
                event.stopPropagation();

                halo.doAjaxInfiniteScrollingGetContent(url, linkInfinite);
            });
        },

        doAjaxInfiniteScrollingGetContent: function(url, link){
            $.ajax({
                type: 'GET',
                url: url,
                beforeSend: function () {
                    link.text(link.attr('data-loading-more'));
                    link.addClass('is-loading');
                    // document.getElementById('CollectionProductGrid').querySelector('.collection').classList.add('is-loading');
                    // $body.addClass('has-halo-loader');
                },
                success: function (data) {
                    halo.ajaxInfiniteScrollingMapData(data);
                },
                error: function (xhr, text) {
                    alert($.parseJSON(xhr.responseText).description);
                },
                complete: function () {
                    link.text(link.attr('data-load-more'));
                    link.removeClass('is-loading');
                    // document.getElementById('CollectionProductGrid').querySelector('.collection').classList.remove('is-loading');
                    // $body.removeClass('has-halo-loader');
                    if (document.querySelector('.collection-masonry')) {
                        resizeAllGridItems();
                    }
                }
            });
        },

        ajaxInfiniteScrollingMapData: function(data){
            var currentTemplate = $('#CollectionProductGrid'),
                currentProductListing = currentTemplate.find('.productListing'),
                currentPagination = currentTemplate.find('.pagination'),
                newTemplate = $(data).find('#CollectionProductGrid'),
                newProductListing = newTemplate.find('.productListing'),
                newPagination = newTemplate.find('.pagination'),
                newProductItem = newProductListing.children('.product');
                
            if (newProductItem.length > 0) {
                currentProductListing.append(newProductItem);
                currentPagination.replaceWith(newPagination);

                $('[data-total-start]').text(1);

                if(window.compare.show){
                    var $compareLink = $('[data-compare-link]');
                    halo.setLocalStorageProductForCompare($compareLink);
                }

                if(window.wishlist.show){
                    halo.setLocalStorageProductForWishlist();
                }

                if (halo.checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                }
            }
        },

        initQuickShopProductList: function() {
            $doc.on('click', '[data-open-quickshop-popup-list]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var handle = $(event.currentTarget).data('product-handle'),
                    product = $(event.currentTarget).closest('.card');

                if(!product.hasClass('quick-shop-show')){
                    halo.updateContentQuickShop(product, handle);
                }
            });

            $doc.on('click', '[data-close-quickshop-popup-list]', (event) => {
                event.preventDefault();
                event.stopPropagation();

                var product = $(event.currentTarget).closest('.card');

                product.removeClass('quick-shop-show');
                product.find('.card-popup-content').empty();
            });

            $doc.on('click', (event) => {
                if($('.card').hasClass('quick-shop-show')){
                    if (($(event.target).closest('[data-open-quickshop-popup-list]').length === 0) && ($(event.target).closest('.card-popup').length === 0)){
                        $('.card').removeClass('quick-shop-show');
                        $('.card').find('.card-popup-content').empty();
                    }
                }
            });
        },

        updateContentQuickShop: function(product, handle) {
            var popup = product.find('.card-popup'),
                popupContent = popup.find('.card-popup-content');

            $.ajax({
                type: 'get',
                url: window.routes.root + '/products/' + handle + '?view=ajax_quick_shop',
                beforeSend: function () {
                    $('.card').removeClass('quick-shop-show');
                },
                success: function (data) {
                    popupContent.append(data);
                },
                error: function (xhr, text) {
                    alert($.parseJSON(xhr.responseText).description);
                },
                complete: function () {
                    product.addClass('quick-shop-show');
                }
            });
        },

        toggleVariantsForExpressOrder: function () {
            var toggleVariant = '[data-toggle-variant]';

            $(document).on('click', toggleVariant, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var self = $(this),
                    curVariants = self.data('target');

                if(self.hasClass('show-options-btn')) {
                    self.text(window.inventory_text.hide_options);
                    $(curVariants).slideDown(700, function () {
                        self.addClass('hide-options-btn').removeClass('show-options-btn');
                    });
                }
                else {
                    self.text(window.inventory_text.show_options);
                    $(curVariants).slideUp(700, function () {
                        self.addClass('show-options-btn').removeClass('hide-options-btn');
                    });
                };
            })
        },

        initExpressOrderAddToCart: function() {
            var addToCartSlt = '[data-express-addtocart]';

            $(document).off('click.addToCartExpress', addToCartSlt).on('click.addToCartExpress', addToCartSlt, function (e) {
                e.preventDefault();

                var self = $(this);

                if (self.attr('disabled') != 'disabled') {
                    var productItem = self.closest('.product-item');

                    if(productItem.length == 0) {
                        productItem = self.closest('.col-options');
                    }

                    var form = productItem.find('form');
                    var variant_id = form.find('select[name=id]').val();

                    if (!variant_id) {
                        variant_id = form.find('input[name=id]').val();
                    };

                    var quantityElm = productItem.find('input[name=quantity]');

                    if(quantityElm.length == 0) {
                        quantityElm = productItem.siblings('.col-qtt').find('input[name=quantity]');
                    }

                    var quantity = quantityElm.val();
                    if (!quantity) {
                        quantity = 1;
                    };

                    if(parseInt(quantity) !== 0) {
                        if (window.ajax_cart == 'none') {
                            form.submit();
                        } else {
                            halo.expressAjaxAddToCart(variant_id, quantity, self, form);
                            form.next('.feedback-text').show();
                        }
                    }
                    else {
                        form.next('.feedback-text').text('Quantity cannot be blank').show();
                    }
                }
                return false;
            });
        },

        expressAjaxAddToCart: function(variant_id, quantity, cartBtn, form) {
            $.ajax({
                type: "post",
                url: "/cart/add.js",
                data: 'quantity=' + quantity + '&id=' + variant_id,
                dataType: 'json',

                beforeSend: function() {
                    window.setTimeout(function() {
                        cartBtn.text(window.inventory_text.adding +"...");
                    }, 100);
                },

                success: function(msg) {
                    window.setTimeout(function() {
                        cartBtn.text(window.inventory_text.thank_you);
                        cartBtn.addClass('add_more');
                        form.next('.feedback-text').text(window.inventory_text.cart_feedback).addClass('is-added');
                    }, 600);
                    window.setTimeout(function() {
                        cartBtn.text(window.inventory_text.add_more + "...");
                    }, 1000);

                    switch (window.after_add_to_cart.type) {
                        case 'cart':
                            halo.redirectTo(window.routes.cart);

                            break;
                        case 'quick_cart':
                            if(window.quick_cart.show){
                                Shopify.getCart((cart) => {
                                    if( window.quick_cart.type == 'popup'){
                                        // $body.addClass('cart-modal-show');
                                        // halo.updateDropdownCart(cart);
                                    } else {
                                        $body.addClass('cart-sidebar-show');
                                        halo.updateSidebarCart(cart);
                                    }
                                });
                            } else {
                                halo.redirectTo(window.routes.cart);
                            }

                            break;
                        case 'popup_cart_1':
                            Shopify.getCart((cart) => {
                                halo.updatePopupCart(cart, 1, variant_id);
                                halo.updateSidebarCart(cart);
                                $body.addClass('add-to-cart-show');
                            });

                            break;
                    }
                },

                error: function(xhr, text) {
                    alert($.parseJSON(xhr.responseText).description);
                    window.setTimeout(function() {
                        cartBtn.text(window.inventory_text.add_to_cart);
                    }, 400);
                }
            });
        },

        initProductBundle: function() {
            var productBundle = $('[data-product-bundle]'),
                bundleList = productBundle.find('[data-bundle-slider]'),
                dots = bundleList.data('dots'),
                arrows = bundleList.data('arrows');

            if(bundleList.length > 0){
                if(!bundleList.hasClass('slick-initialized')){
                    bundleList.slick({
                        dots: true,
                        arrows: arrows,
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        mobileFirst: true,
                        infinite: false,
                        nextArrow: window.arrows.icon_next,
                        prevArrow: window.arrows.icon_prev,
                        rtl: window.rtl_slick,
                        responsive: [
                            {
                                breakpoint: 1200,
                                settings: {
                                    slidesToShow: 4,
                                    slidesToScroll: 1,
                                    dots: dots
                                }
                            },
                            {
                                breakpoint: 551,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 1,
                                    dots: dots
                                }
                            }
                        ]
                    });

                    productBundle.find('.bundle-product-wrapper').removeClass('has-halo-block-loader');

                    bundleList.on('afterChange', function(){
                        bundleList.find('.bundle-product-item').removeClass('is-open');
                    });
                }
            }
        },

        initDynamicBrowserTabTitle: function() {
            if(window.dynamic_browser_title.show){
                var pageTitleContent = document.title,
                    newPageTitleContent = window.dynamic_browser_title.text;

                window.onblur = function () {
                    document.title = window.dynamic_browser_title.text;
                }

                window.onfocus = function () {
                    document.title = pageTitleContent;
                }
            }
        },

        initWarningPopup: function() {
            this.warningPopup = document.querySelector('[data-warning-popup]');
            this.warningPopupContent = this.warningPopup.querySelector('[data-halo-warning-content]');
            this.warningPopupCloseButton = this.warningPopup.querySelector('[data-close-warning-popup]');
            this.warningPopupCloseButton.addEventListener('click', () => {
                document.body.classList.remove('has-warning');
            })

            document.body.addEventListener('click', () => {
                if (!event.target.closest('[data-warning-popup]')) {
                    document.body.classList.remove('has-warning');
                }
            })
           
            this.warningTime = 3000
            this.warningTimeout = undefined;

            window.warningTimeout = this.warningTimeout;
        },  

        showWarning: function(content, time = this.warningTime) {
            if (this.warningTimeout) {
                clearTimeout(this.warningTimeout);
            }

            this.warningPopupContent.textContent = content;
            document.body.classList.add('has-warning');
            
            if (time) {
                this.warningTimeout = setTimeout(() => {
                    document.body.classList.remove('has-warning');
                }, time);
            }
        },

        backgroundOverlayHoverEffect: function() {
            const backgroundOverlay = document.querySelector('.background-overlay')
            const backgroundCursorWrapper = backgroundOverlay.firstChild

            const enlargeCursor = () => {
                backgroundCursorWrapper.classList.add('enlarge-cursor')
            }

            const dwindleCursor = () => {
                backgroundCursorWrapper.classList.remove('enlarge-cursor')
            }

            const setCursorPosition = (clientX, clientY) => {
                requestAnimationFrame(() => {
                    backgroundCursorWrapper.style.setProperty('--translate-y', clientY)
                    backgroundCursorWrapper.style.setProperty('--translate-x', clientX)
                })
            }

            const handleMouseMove = (e) => {
                setCursorPosition(e.clientX, e.clientY)                
            }

            const handleMouseEnter = (e) => {
                setCursorPosition(e.clientX, e.clientY)
                enlargeCursor()
            }
            
            const handleMouseLeave = e => {
                setCursorPosition(e.clientX, e.clientY)
                backgroundCursorWrapper.removeEventListener('mousemove', handleMouseMove)
                dwindleCursor()
            }

            backgroundOverlay.addEventListener('mouseenter', handleMouseEnter)
            backgroundOverlay.addEventListener('mouseleave', handleMouseLeave)
            backgroundOverlay.addEventListener('mousemove', handleMouseMove)
            backgroundOverlay.addEventListener('click', dwindleCursor)
        },
        backgroundOverlayHoverEffect1: function() {
            const backgroundOverlay = document.querySelector('.background-overlay1')
            if (!backgroundOverlay) return;
          
            const backgroundCursorWrapper = backgroundOverlay.firstChild

            const enlargeCursor = () => {
                backgroundCursorWrapper.classList.add('enlarge-cursor')
            }

            const dwindleCursor = () => {
                backgroundCursorWrapper.classList.remove('enlarge-cursor')
            }

            const setCursorPosition = (clientX, clientY) => {
                requestAnimationFrame(() => {
                    backgroundCursorWrapper.style.setProperty('--translate-y', clientY)
                    backgroundCursorWrapper.style.setProperty('--translate-x', clientX)
                })
            }

            const handleMouseMove = (e) => {
                setCursorPosition(e.clientX, e.clientY)                
            }

            const handleMouseEnter = (e) => {
                setCursorPosition(e.clientX, e.clientY)
                enlargeCursor()
            }
            
            const handleMouseLeave = e => {
                setCursorPosition(e.clientX, e.clientY)
                backgroundCursorWrapper.removeEventListener('mousemove', handleMouseMove)
                dwindleCursor()
            }

            backgroundOverlay.addEventListener('mouseenter', handleMouseEnter)
            backgroundOverlay.addEventListener('mouseleave', handleMouseLeave)
            backgroundOverlay.addEventListener('mousemove', handleMouseMove)
            backgroundOverlay.addEventListener('click', dwindleCursor)
        },
        
        productCustomInformation() {
            const $customInfo = $('[data-custom-information]');
            const $thisPopup = $('#halo-product-custom-information');
            
            $customInfo.on('click', (event) => {
                const $this = $(event.currentTarget);
                const title = $this.find('.title')[0].innerText;
                const thisContent = $this.find('.product-customInformation__popup').html();

                if (thisContent === "" || thisContent == null) return;
                $thisPopup.addClass('is-show');
                $thisPopup.find('.halo-popup-title').text(title);
                $thisPopup.find('.halo-popup-content').html(thisContent);
                $body.addClass('is-custom-information');
            });

            $doc.on('click', '[data-close-custom-information]', () => {
                $body.removeClass('is-custom-information');
                $thisPopup.removeClass('is-show');
            });

            $doc.on('click', (event) => {
                if ($body.hasClass('is-custom-information')) {
                    if (($(event.target).closest('#halo-product-custom-information').length === 0) && ($(event.target).closest('[data-custom-information]').length === 0)) {
                        $body.removeClass('is-custom-information');
                    }
                }
            });
        },

        initLazyloadObserver(loadingImages, productGrid) {
            const setLazyLoaded = (target) => {
                const card = target.closest('.card')
                card.classList.add('ajax-loaded')
            }

            this.lazyloadedObserver = new MutationObserver((mutationList, observer) => {
                mutationList.forEach((mutation) => {
                    if (mutation.type == 'attributes') {
                        if (!mutation.target.classList.contains('lazyloaded')) return 
                        setLazyLoaded(mutation.target)
                    }
                })
            }) 
            
            const parentObserver = new MutationObserver((mutationlist) => {
                mutationlist.forEach((mutation) => {
                    if (mutation.type == 'childList') {
                        const addedLoadingImages = [...mutation.addedNodes].map(node => node.querySelector('.media--loading-effect img'))
                        addedLoadingImages.forEach(image => {
                            if (image) {
                                this.lazyloadedObserver.observe(image, { childList: true, attributes: true })
                            }
                        })    
                    }
                })
            }) 

            if (productGrid) parentObserver.observe(productGrid, { subtree: false, childList: true });
            if (loadingImages.length > 0) loadingImages.forEach(image => {
                if (image.classList.contains('lazyloaded')) {
                    setLazyLoaded(image)
                } else {
                    this.lazyloadedObserver.observe(image, { childList: true, attributes: true })
                }
            })
        },

        observeImageLazyloaded(images) {
            images.forEach(image => {
                this.lazyloadedObserver.observe(image, { childList: true, attributes: true })
            })
        },

        iconZoomClickMobile() {
            const iconZoom = $('.productView-iconZoom');
            iconZoom.on('click', (event) => {
                document.querySelector('.productView-image .productView-img-container .media').click();
            });
        },

        calculateTranslateYHeight() {
            const cardActions = document.querySelectorAll('.card .card-action:not(.variants-popup-form)');
            let heighest = 0;
          
            if (!cardActions.length) return;
            cardActions.forEach(cardAction => {
              cardAction.classList.add('temporary-show');
            
              const height = cardAction.clientHeight ;
              if (height > heighest) heighest = height;
  
              cardAction.classList.remove('temporary-show');
            })
            document.body.style.setProperty('--translate-y-height', heighest * -1 + 'px');
        },

        checkScrollLayoutForRecenlyViewed() {
            const RecentlyViewedSection = document.getElementById('recently-viewed-products-list-2');

            if (RecentlyViewedSection && RecentlyViewedSection.classList.contains('products-flex')) {
                const RecentlyViewedObserver = new MutationObserver((mutationList, observer) => {
                    const mutationRecentlyViewed = mutationList[0];

                    if (mutationRecentlyViewed.type == 'attributes' 
                        && mutationRecentlyViewed.target.classList.contains('recently-viewed-loaded')) {

                        observer.disconnect();
                    }
                })

                RecentlyViewedObserver.observe(RecentlyViewedSection, { attributes: true });
            }
        },
      
        clickIconScrollSection() {
            if (!document.querySelector('.arrow-icon-scroll')) return;
            let isScrollingDown = 'next';
            const sections = document.querySelectorAll('.wrapper-body .shopify-section'),
              sectionsLength = sections.length,
              sectionFirstHeight = sections[0]?.getBoundingClientRect().height || 0,
              sectionEndHeight = sections[sectionsLength - 1]?.getBoundingClientRect().height || 0,
              footerHeight = document.querySelectorAll('.shopify-section-group-footer-group')[0]?.getBoundingClientRect().height || 0;

              if (window.pageYOffset + sectionEndHeight >= document.documentElement.scrollHeight - footerHeight - 100) loadRotateArrow('prev');
            
              $(window).scroll(function() {
                  if (window.pageYOffset + sectionEndHeight >= document.documentElement.scrollHeight - footerHeight - 100) loadRotateArrow('prev');
                  else if (window.pageYOffset <= sectionFirstHeight/2) loadRotateArrow('next');
              });
            
              $doc.on('click', '.arrow-icon-scroll', (event) => {
                  let checkScroll = true;
                  const headerHeight = window.innerWidth > 1024 ? document.querySelectorAll('sticky-header')[0]?.getBoundingClientRect().height : document.querySelector('sticky-header-mobile')?.getBoundingClientRect().height || 0,
                    footerTop = document.querySelectorAll('.shopify-section-group-footer-group')[0]?.getBoundingClientRect().top || -1;
                
                  sections.forEach((element, index) => {
                      if (!checkScroll) return;
                      const thisTop = element.getBoundingClientRect().top;
                    
                      if (thisTop >= 0) {
                          checkScroll = false;
                        
                          if (isScrollingDown == 'next') {
                              if (element.nextElementSibling != null) scrollToSection(element.nextElementSibling.offsetTop - headerHeight);
                              sectionsLength == index + 2 || element.nextElementSibling == null ? loadRotateArrow('prev') : loadRotateArrow('next');
                          }
                          else {
                              if (element.previousElementSibling != null) scrollToSection(element.previousElementSibling.offsetTop - headerHeight);
                              index == 1 || element.previousElementSibling == null ? loadRotateArrow('next') : loadRotateArrow('prev');
                          }
                      }
                      else if (footerTop >= 0) scrollToSection(sections[sectionsLength - 1].offsetTop - headerHeight);
                  });
              });
            
              function scrollToSection(scope, rotate) {
                  window.scrollTo({top: scope, behavior: "smooth"});
              }
  
              function loadRotateArrow(rotate) {
                  isScrollingDown = rotate;
                  rotate == 'next' ? document.querySelector('.arrow-icon-scroll').classList.remove('rotate') : document.querySelector('.arrow-icon-scroll').classList.add('rotate');
              }
        },

        specialBanner() {
            const banners = document.querySelectorAll('[sticky-special-banner]'),
              wdWidth = window.innerWidth,
              wdHeight = window.innerHeight,
              headerHeight = wdWidth > 1024 ? document.querySelectorAll('sticky-header')[0]?.getBoundingClientRect().height : document.querySelector('sticky-header-mobile')?.getBoundingClientRect().height || 0;
          
            if (banners) {
                banners.forEach(element => {
                    const banner = element.querySelector('.special-banner__img_box'),
                      bannerWrap = element.querySelector('.special-banner__img'),  
                      wrapperHeight = element.closest('.special-banner__wrapper').getBoundingClientRect().height,
                      bannerHeight = bannerWrap.getBoundingClientRect().height;
                  
                    let top = headerHeight || 0;
                    if (wdWidth >= 1200) {
                        if (wrapperHeight > bannerHeight) {
                            if (wdHeight > bannerHeight) top = (wdHeight - bannerHeight)/2;
                            calculateSticky(banner, top);
                        }
                    }
                    else if (wdWidth >= 768 && wdWidth < 1200) {
                        if (wrapperHeight > bannerHeight) {
                            calculateSticky(banner, top);
                        }
                    }
                    else {
                        element.classList.remove('is-sticky');
                        element.style.top = ``;
                    }
                });
            }

            function calculateSticky(banner, top) {
                banner.classList.add('is-sticky');
                banner.style.top = `${top}px`;
            }
        },

        specialBannerSlider() {
            const productGrid = $('.special-banner__products--grid'),
              wdWidth = window.innerWidth;
          
            if (productGrid) {
                productGrid.each(function(index, element) {
                    const $this = $(element),
                      $block = $this.closest('.special-banner__product');
                    
                    if (!$block.hasClass('ajax-loaded')) return;
                    
                    if (wdWidth < 1200) {
                        if (!$this.hasClass('slick-initialized')) {
                            $this.addClass('products-carousel');
                            specialProductSlider($block);
                        }
                    }
                    else {
                        if ($this.hasClass('slick-initialized')) {
                            $this.slick('unslick');
                            $this.removeClass('products-carousel');
                        }
                    }
                })
            }

            function specialProductSlider(wrapper) {
                let productGrid = wrapper.find('.products-carousel'),
                    itemToShow = productGrid.data('item-to-show'),
                    itemDots = productGrid.data('item-dots'),
                    itemDotsMb = productGrid.data('item-dots-mb'),
                    itemArrows = productGrid.data('item-arrows'),
                    itemArrowsMb = productGrid.data('item-arrows-mb');
    
                productGrid.slick({
                    mobileFirst: true,
                    adaptiveHeight: true,
                    infinite: true,
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    arrows: itemArrowsMb,
                    dots: itemDotsMb,
                    nextArrow: window.arrows.icon_next,
                    prevArrow: window.arrows.icon_prev,
                    rtl: window.rtl_slick,
                    responsive: 
                    [
                        {
                            breakpoint: 767,
                            settings: {
                                arrows: itemArrows,
                                dots: itemDots,
                                slidesToShow: itemToShow,
                                slidesToScroll: itemToShow,
                            }
                        }
                    ]
                });
            }
        },

        unsymmetricalSlider(){
            const productUnsy = $('.unsymmetrical-slider'),
              wdWidth = $(window).width();

                if(productUnsy){
                    productUnsy.each(function(index, element) {
                    const $this = $(element),
                        $block = $this.closest('.halo-block-content');
                    
                    if (!$block.hasClass('ajax-loaded')) return;
                    
                    if (wdWidth < 1200) {
                        if (!$this.hasClass('slick-initialized')) {
                            $this.addClass('products-carousel');
                            setTimeout(() => {
                                unsymmetricalProductSlider($block);
                            }, 1000);
                        }
                    }
                    else {
                        if ($this.hasClass('slick-initialized')) {
                            $this.slick('unslick');
                            $this.removeClass('products-carousel');
                        }
                    }
                })

                function unsymmetricalProductSlider(wrapper) {
                    let productGrid = wrapper.find('.products-carousel'),
                        itemToShow = productGrid.data('item-to-show'),
                        itemDots = productGrid.data('item-dots'),
                        itemArrows = productGrid.data('item-arrows');

                    if (productGrid.hasClass('enable_progress_bar')) {
                        var progressBar = wrapper.find('.scrollbar-thumb');
                        productGrid.on('init', (event, slick) => {
                            var percent = ((slick.currentSlide / (slick.slideCount - 1)) * 100) + '%';
                            progressBar.css('--percent', percent);
                        });
                    }
        
                    productGrid.slick({
                        mobileFirst: true,
                        adaptiveHeight: true,
                        infinite: true,
                        slidesToShow: 1.5,
                        slidesToScroll: 1,
                        arrows: itemArrows,
                        nextArrow: window.arrows.icon_next,
                        prevArrow: window.arrows.icon_prev,
                        rtl: window.rtl_slick,
                        dots: itemDots,
                        get initialSlide() {
                            return this.initialSlide = 0.5;
                        },
                        responsive: 
                        [
                            {
                                breakpoint: 767,
                                settings: {
                                    arrows: itemArrows,
                                    slidesToShow: itemToShow,
                                    dots: itemDots,
                                    slidesToScroll: itemToShow,
                                    get slidesToScroll() {
                                        if(itemToShow !== undefined && itemToShow !== null && itemToShow !== '' && itemToShow !== 1.5 && itemToShow !== 2.5 && itemToShow !== 3.5){
                                            return this.slidesToScroll = itemToShow;
                                        } else {
                                            return this.slidesToScroll = 1;
                                        }
                                    },
                                    get initialSlide() {
                                        if(itemToShow !== 1.5 && itemToShow == 2.5 || itemToShow == 3.5) {
                                            return this.initialSlide = 0.5;
                                        } else {
                                            return this.initialSlide = 0;
                                        }
                                    }
                                }
                            }
                        ]
                    });

                    if (productGrid.hasClass('enable_progress_bar')) {
                        productGrid.on('afterChange', (event, slick, nextSlide) => {
                            let number = 0;
                            if(wdWidth > 767) {
                                if(itemToShow == 1.5 || itemToShow == 2.5 || itemToShow == 3.5) {
                                    number = 0.5;
                                } else {
                                    number = 0;
                                }
                            } else {
                                number = 0.5;
                            }
                            var percent = (((nextSlide - number ) / (slick.slideCount - 1)) * 100) + '%';
                            progressBar.css('--percent', percent);
                        });
                    }
                }
            }
        },

        productCountdownCard: function(){
            var wrapper = $('.card .card-countDown').find('[data-countdown-id]'),
                countDown = wrapper.data('countdown'),
                countDownDate = new Date(countDown).getTime(),
                countDownText = window.countdown.text;

            if(wrapper.length > 0) {
                var countdownfunction = setInterval(function() {
                    var now = new Date().getTime(),
                        distance = countDownDate - now;

                    if (distance < 0) {
                        clearInterval(countdownfunction);
                        wrapper.remove();
                    } else {
                        var days = Math.floor(distance / (1000 * 60 * 60 * 24)),
                            hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                            minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                            seconds = Math.floor((distance % (1000 * 60)) / 1000),
                            strCountDown;

                            strCountDown = '<span class="text"><span>'+ countDownText +'</span></span><span class="num">'+days+'<span>'+ window.countdown.day +'</span></span>\
                                <span class="num">'+hours+'<span class="icon">:</span></span>\
                                <span class="num">'+minutes+'<span class="icon">:</span></span>\
                                <span class="num">'+seconds+'</span>';

                        wrapper.html(strCountDown);
                        wrapper.addClass('show');
                    }
                }, 1000);
            }
        },

        typingAnimation() {
            // typing multiple text 
            $.fn.textType = function (rotate, period) {
                return this.each(function () {
                    var $this = $(this);
                    var textType = new TextType($this, rotate, period);
                });
            };

            var TextType = function (element, rotate, period) {
                this.rotate = rotate;
                this.$element = $(element);
                this.loopNum = 0;
                this.period = parseInt(period, 10) || 2000;
                this.text = '';
                this.tick();
                this.isDeleting = false;
            };

            TextType.prototype.tick = function () {
                var i = this.loopNum % this.rotate.length;
                var fullText = this.rotate[i];

                if (this.isDeleting) {
                    this.text = fullText.substring(0, this.text.length - 1);
                } else {
                    this.text = fullText.substring(0, this.text.length + 1);
                }

                this.$element.find('[data-text-convert]').html(`<span class="text">${this.text}</span>`);

                var that = this;
                var delta = 200 - Math.random() * 100;

                if (this.isDeleting) {
                    delta /= 2;
                }

                if (!this.isDeleting && this.text === fullText) {
                    delta = this.period;
                    this.isDeleting = true;
                } else if (this.isDeleting && this.text === '') {
                    this.isDeleting = false;
                    this.loopNum++;
                    delta = 500;
                }

                setTimeout(function () {
                    that.tick();
                }, delta);
            };

            // typing full text and split with comma
            $.fn.textTypeMultipleSentences = function (period) {
                return this.each(function () {
                    var $this = $(this);
                    var textType = new MultipleSentencesType($this, period);
                });
            };

            var MultipleSentencesType = function (element, period) {
                this.$element = $(element);
                this.sentences = JSON.parse(this.$element.attr('data-type'));
                this.period = parseInt(period, 10) || 2000;
                this.sentenceIndex = 0;
                this.setupCurrentSentence();
                this.isDeleting = false;
                this.isPaused = false;
                this.tick();
            };

            MultipleSentencesType.prototype.setupCurrentSentence = function () {
                this.currentTextArray = this.sentences[this.sentenceIndex].split(',').map(word => word.trim());
                this.fullTextArray = this.currentTextArray;
                this.displayedWords = this.currentTextArray.map(() => '');
            };

            MultipleSentencesType.prototype.tick = function () {
                var that = this;
                var completedTextArray = this.fullTextArray;

                if (!this.isDeleting && !this.isPaused) {
                    for (let i = 0; i < this.currentTextArray.length; i++) {
                        if (this.displayedWords[i] !== completedTextArray[i]) {
                            this.displayedWords[i] = completedTextArray[i].substring(0, this.displayedWords[i].length + 1);
                            break;
                        }
                    }

                    if (this.displayedWords.join(' ') === completedTextArray.join(' ')) {
                        this.isPaused = true;
                        setTimeout(function () {
                            that.isPaused = false;
                            that.isDeleting = true;
                        }, 1000);
                    }
                } else if (this.isDeleting) {
                    for (let i = this.currentTextArray.length - 1; i >= 0; i--) {
                        if (this.displayedWords[i] !== '') {
                            this.displayedWords[i] = this.displayedWords[i].substring(0, this.displayedWords[i].length - 1);
                            break;
                        }
                    }

                    if (this.displayedWords.join('') === '') {
                        this.isDeleting = false;
                        this.sentenceIndex = (this.sentenceIndex + 1) % this.sentences.length;
                        this.setupCurrentSentence();
                    }
                }

                var spans = this.displayedWords.map(word => `<span class="text">${word}</span>`).join(' ');
                this.$element.html(spans);

                var delta = 150 - Math.random() * 50;
                if (this.isPaused) {
                    delta = this.period;
                } else if (this.isDeleting && this.displayedWords.join('') === '') {
                    delta = 500;
                }

                setTimeout(function () {
                    that.tick();
                }, delta);
            };

            //use
            if ($("type-writer").length) {
                $("type-writer").each(function (index, el) {
                    const rotate = $(this).attr('data-type');
                    const period = $(this).attr('data-period');

                    if ($(this).hasClass('typing-comma')) {
                        new MultipleSentencesType($(this), period);

                    } else {
                        if (rotate) {
                            new TextType($(this), JSON.parse(rotate), period);
                        }
                    }
                })
            }


        },

        spotlightproductSlider: function(){
            var productSpotlight = $('[data-spotlight-product]');
            if (!productSpotlight.length > 0) return;

            productSpotlight.each((index, element) => {
                var self = $(element),
                    productGrid = self.find('.spotlight-products__products--slider'),
                    itemDots = productGrid.data('item-dots'),
                    itemDotsMB = productGrid.data('item-dots-mb'),
                    itemArrows = productGrid.data('item-arrows'),
                    itemArrowsMB = productGrid.data('item-arrows-mb');

                if(productGrid.length > 0){
                    if(!productGrid.hasClass('slick-initialized')){
                        productGrid.slick({
                            mobileFirst: true,
                            adaptiveHeight: false,
                            infinite: false,
                            vertical: false,
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            dots: itemDotsMB,
                            arrows: itemArrowsMB,
                            nextArrow: window.arrows.icon_next,
                            prevArrow: window.arrows.icon_prev,
                            rtl: window.rtl_slick,
                            focusOnSelect: true,
                            responsive: [
                            {
                                breakpoint: 1025,
                                settings: {
                                    dots: itemDots,
                                    arrows: itemArrows
                                }
                            }]
                        });

                        productGrid.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
                            const section = $(event.target).parents('.spotlight-products');
                            section.find('.point-button').removeClass('active');
                            section.find(`[data-slide="${nextSlide+1}"]`).addClass('active');
                        });
                    }
                }
            });

            $('.spotlight-products__product_point .point-button').click(function(e) {
                e.preventDefault();
                const $this = $(this);
                const section = $this.parents('.spotlight-products');
                const slider = section.find('.spotlight-products__products--slider');
                slider.slick('slickGoTo', $this.data('slide') - 1);
            });
        },

        activeCheckboxStickyCartMobile: function(){
            var enableSticky = $('.enable_sticky_buttton');
            if (!enableSticky.length) return;

            var buttonDisable = $('.button-disable'),
                stickyButtonMB = $('.sticky_button_checkout_mb'),
                haloStickyToolbar = $('.halo-sticky-toolbar-mobile'),
                heightToolbar = haloStickyToolbar.outerHeight();

            buttonDisable.on('click', function () {
                stickyButtonMB.addClass('active');
            });

            if(haloStickyToolbar.length > 0) {
                stickyButtonMB.css('bottom', heightToolbar);
            } else {
                stickyButtonMB.css('bottom','0px');
            }
        }
    }
})(jQuery);