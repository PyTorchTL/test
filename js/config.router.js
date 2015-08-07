'use strict';

/**
 * Config for the router
 */
angular.module('app')
  .run(
    [          '$rootScope', '$state', '$stateParams',
      function ($rootScope,   $state,   $stateParams) {
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;
      }
    ]
  )
  .config(
    [          '$stateProvider', '$urlRouterProvider', 'JQ_CONFIG',
      function ($stateProvider,   $urlRouterProvider, JQ_CONFIG) {

          $urlRouterProvider
              .otherwise('/app/dashboard-v1');
          $stateProvider
              .state('app', {
                  abstract: true,
                  url: '/app',
                  templateUrl: 'tpl/app.html'
              })

              //new
              .state('app.home', {
                  url: '/home',
                  templateUrl: 'tpl/app_home.html'
              })
              .state('app.product', {
                  url: '/product',
                  template: '<div ui-view class="fade-in-up"></div>'
              })
              .state('app.product.new', {
                  url: '/new',
                  templateUrl: 'tpl/product_new.html'
              })
              //产品录入
               .state('app.product.newFixed', {
                  url: '/newfixed',
                  templateUrl: 'tpl/product_new_fixed.html',
                  controller: 'ProductFixedCrtCtrl'
              })
              .state('app.product.newFloating', {
                  url: '/newfloating',
                  templateUrl: 'tpl/product_new_floating.html',
                  controller: 'ProductFloatingCrtCtrl'
              })
              .state('app.product.newBadAsset', {
                  url: '/newbadasset',
                  templateUrl: 'tpl/product_new_badasset.html',
                  controller: 'ProductBadassetCrtCtrl'
              })
              .state('app.product.discuss', {
                  url: '/discuss',
                  templateUrl: 'tpl/product_discuss.html',
                  controller: 'ProductDiscussListCtrl'
              })
              .state('app.product.open', {
                  url: '/open',
                  templateUrl: 'tpl/product_open.html',
                  controller: 'ProductOpenCtrl'
              })
              .state('app.product.establish', {
                  url: '/establish',
                  templateUrl: 'tpl/product_establish.html',
                  controller: 'ProductEstablishCtrl'
              })
              // .state('app.product.setting', {
              //     url: '/setting',
              //     templateUrl: 'tpl/product_setting.html'
              // })
              .state('app.product.networth', {
                  url: '/networth',
                  templateUrl: 'tpl/product_networth.html',
                  controller: 'ProductNetworthSettingCtrl'
              })
              .state('app.product.distribution', {
                  url: '/distribution',
                  templateUrl: 'tpl/product_distribution.html',
                  controller: 'ProductDistributionCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad', 'uiLoad',
                        function( $ocLazyLoad, uiLoad ){
                          return uiLoad.load(
                            JQ_CONFIG.fullcalendar//.concat('js/app/calendar/calendar.js')
                          ).then(
                            function(){
                              return $ocLazyLoad.load('ui.calendar');
                            }
                          );
                      }]
                  }
              })
              .state('app.product.list', {
                  url: '/list',
                  templateUrl: 'tpl/product_list.html'
              })
              .state('app.invest', {
                  url: '/invest',
                  template: '<div ui-view class="fade-in-up"></div>'
              })
              .state('app.invest.subscribelist', {
                  url: '/subscribelist',
                  templateUrl: 'tpl/invest_subscribelist.html'
              })
              .state('app.invest.subscriberecord', {
                  url: '/subscriberecord',
                  templateUrl: 'tpl/invest_subscriberecord.html'
              })
              .state('app.invest.purchaserecord', {
                  url: '/purchaselist',
                  templateUrl: 'tpl/invest_purchaserecord.html'
              })
              .state('app.invest.purchaseapprove', {
                  url: '/purchaseapprove',
                  templateUrl: 'tpl/invest_purchaseapprove.html'
              })
              .state('app.customer', {
                  url: '/customer',
                  template: '<div ui-view class="fade-in-up"></div>'
              })
              .state('app.customer.list', {
                  url: '/list',
                  templateUrl: 'tpl/customer_list.html'
              })
              .state('app.customer.contact', {
                  url: '/contact',
                  templateUrl: 'tpl/customer_contact.html'
              })
              .state('app.activity', {
                  url: '/activity',
                  template: '<div ui-view class="fade-in-up"></div>'
              })
              .state('app.activity.new', {
                  url: '/new',
                  templateUrl: 'tpl/activity_new.html',
                  controller: 'ActivityNewCtrl'
              })
              .state('app.activity.firstreview', {
                  url: '/firstreview',
                  templateUrl: 'tpl/activity_firstreview.html',
                  controller: 'ActivityFirstReviewCtrl'
              })
              .state('app.activity.sign', {
                  url: '/sign',
                  templateUrl: 'tpl/activity_sign.html',
                  controller: 'ActivitySignCtrl'
              })
              .state('app.activity.finalreview', {
                  url: '/finalreview',
                  templateUrl: 'tpl/activity_finalreview.html',
                  controller: 'ActivityFinalReviewCtrl'
              })
              .state('app.activity.list', {
                  url: '/list',
                  templateUrl: 'tpl/activity_list.html',
                  controller: 'ActivityListCtrl'
              })
              .state('app.activity.subscribe', {
                  url: '/subscribe',
                  templateUrl: 'tpl/activity_subscribe.html',
                  controller: 'ActivitySubscribeCtrl'
              })
              .state('app.activity.feedback', {
                  url: '/feedback',
                  templateUrl: 'tpl/activity_feedback.html',
                  controller: 'ActivityFeedbackCtrl'
              })
              .state('app.message', {
                  url: '/message',
                  template: '<div ui-view class="fade-in-up"></div>'
              })
              .state('app.message.notification', {
                  url: '/notification',
                  templateUrl: 'tpl/message_notification.html'
              })
              .state('app.message.send', {
                  url: '/send',
                  templateUrl: 'tpl/message_send.html',
                  controller: 'SendMessageCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('hierarchical-selector');
                      }]
                  }

              })
              .state('app.message.list', {
                  url: '/list',
                  templateUrl: 'tpl/message_list.html'
              })
              .state('app.report', {
                  url: '/report',
                  template: '<div ui-view class="fade-in-up"></div>'
              })
              .state('app.report.sale', {
                  url: '/sale',
                  templateUrl: 'tpl/report_sale.html'
              })
              .state('app.report.subscribe', {
                  url: '/subscribe',
                  templateUrl: 'tpl/report_subscribe.html'
              })
              .state('app.report.statement', {
                  url: '/statement',
                  templateUrl: 'tpl/report_statement.html'
              })
              .state('app.setting', {
                  url: '/setting',
                  template: '<div ui-view class="fade-in-up"></div>'
              })
              .state('app.setting.profile', {
                  url: '/profile',
                  templateUrl: 'tpl/setting_profile.html'
              })
              .state('app.setting.password', {
                  url: '/password',
                  templateUrl: 'tpl/setting_password.html'
              })
              .state('app.dashboard-v1', {
                  url: '/dashboard-v1',
                  templateUrl: 'tpl/app_dashboard_v1.html',
                  resolve: {
                    deps: ['$ocLazyLoad',
                      function( $ocLazyLoad ){
                        return $ocLazyLoad.load(['js/controllers/chart.js']);
                    }]
                  }
              })
              .state('app.dashboard-v2', {
                  url: '/dashboard-v2',
                  templateUrl: 'tpl/app_dashboard_v2.html',
                  resolve: {
                    deps: ['$ocLazyLoad',
                      function( $ocLazyLoad ){
                        return $ocLazyLoad.load(['js/controllers/chart.js']);
                    }]
                  }
              })
              .state('app.ui', {
                  url: '/ui',
                  template: '<div ui-view class="fade-in-up"></div>'
              })
              .state('app.ui.buttons', {
                  url: '/buttons',
                  templateUrl: 'tpl/ui_buttons.html'
              })
              .state('app.ui.icons', {
                  url: '/icons',
                  templateUrl: 'tpl/ui_icons.html'
              })
              .state('app.ui.grid', {
                  url: '/grid',
                  templateUrl: 'tpl/ui_grid.html'
              })
              .state('app.ui.widgets', {
                  url: '/widgets',
                  templateUrl: 'tpl/ui_widgets.html'
              })
              .state('app.ui.bootstrap', {
                  url: '/bootstrap',
                  templateUrl: 'tpl/ui_bootstrap.html'
              })
              .state('app.ui.sortable', {
                  url: '/sortable',
                  templateUrl: 'tpl/ui_sortable.html'
              })
              .state('app.ui.scroll', {
                  url: '/scroll',
                  templateUrl: 'tpl/ui_scroll.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad){
                          return uiLoad.load('js/controllers/scroll.js');
                      }]
                  }
              })
              .state('app.ui.portlet', {
                  url: '/portlet',
                  templateUrl: 'tpl/ui_portlet.html'
              })
              .state('app.ui.timeline', {
                  url: '/timeline',
                  templateUrl: 'tpl/ui_timeline.html'
              })
              .state('app.ui.tree', {
                  url: '/tree',
                  templateUrl: 'tpl/ui_tree.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('angularBootstrapNavTree').then(
                              function(){
                                 return $ocLazyLoad.load('js/controllers/tree.js');
                              }
                          );
                        }
                      ]
                  }
              })
              .state('app.ui.toaster', {
                  url: '/toaster',
                  templateUrl: 'tpl/ui_toaster.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad){
                          return $ocLazyLoad.load('toaster').then(
                              function(){
                                 return $ocLazyLoad.load('js/controllers/toaster.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.ui.jvectormap', {
                  url: '/jvectormap',
                  templateUrl: 'tpl/ui_jvectormap.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad){
                          return $ocLazyLoad.load('js/controllers/vectormap.js');
                      }]
                  }
              })
              .state('app.ui.googlemap', {
                  url: '/googlemap',
                  templateUrl: 'tpl/ui_googlemap.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( [
                            'js/app/map/load-google-maps.js',
                            'js/app/map/ui-map.js',
                            'js/app/map/map.js'] ).then(
                              function(){
                                return loadGoogleMaps();
                              }
                            );
                      }]
                  }
              })
              .state('app.chart', {
                  url: '/chart',
                  templateUrl: 'tpl/ui_chart.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad){
                          return uiLoad.load('js/controllers/chart.js');
                      }]
                  }
              })
              // table
              .state('app.table', {
                  url: '/table',
                  template: '<div ui-view></div>'
              })
              .state('app.table.static', {
                  url: '/static',
                  templateUrl: 'tpl/table_static.html'
              })
              .state('app.table.datatable', {
                  url: '/datatable',
                  templateUrl: 'tpl/table_datatable.html'
              })
              .state('app.table.footable', {
                  url: '/footable',
                  templateUrl: 'tpl/table_footable.html'
              })
              .state('app.table.grid', {
                  url: '/grid',
                  templateUrl: 'tpl/table_grid.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('ngGrid').then(
                              function(){
                                  return $ocLazyLoad.load('js/controllers/grid.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.table.uigrid', {
                  url: '/uigrid',
                  templateUrl: 'tpl/table_uigrid.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('ui.grid').then(
                              function(){
                                  return $ocLazyLoad.load('js/controllers/uigrid.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.table.editable', {
                  url: '/editable',
                  templateUrl: 'tpl/table_editable.html',
                  controller: 'XeditableCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('xeditable').then(
                              function(){
                                  return $ocLazyLoad.load('js/controllers/xeditable.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.table.smart', {
                  url: '/smart',
                  templateUrl: 'tpl/table_smart.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('smart-table').then(
                              function(){
                                  return $ocLazyLoad.load('js/controllers/table.js');
                              }
                          );
                      }]
                  }
              })
              // form
              .state('app.form', {
                  url: '/form',
                  template: '<div ui-view class="fade-in"></div>',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load('js/controllers/form.js');
                      }]
                  }
              })
              .state('app.form.components', {
                  url: '/components',
                  templateUrl: 'tpl/form_components.html',
                  resolve: {
                      deps: ['uiLoad', '$ocLazyLoad',
                        function( uiLoad, $ocLazyLoad ){
                          return uiLoad.load( JQ_CONFIG.daterangepicker )
                          .then(
                              function(){
                                return uiLoad.load('js/controllers/form.components.js');
                              }
                          ).then(
                              function(){
                                return $ocLazyLoad.load('ngBootstrap');
                              }
                          );
                        }
                      ]
                  }
              })
              .state('app.form.elements', {
                  url: '/elements',
                  templateUrl: 'tpl/form_elements.html'
              })
              .state('app.form.validation', {
                  url: '/validation',
                  templateUrl: 'tpl/form_validation.html'
              })
              .state('app.form.wizard', {
                  url: '/wizard',
                  templateUrl: 'tpl/form_wizard.html'
              })
              .state('app.form.fileupload', {
                  url: '/fileupload',
                  templateUrl: 'tpl/form_fileupload.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad){
                          return $ocLazyLoad.load('angularFileUpload').then(
                              function(){
                                 return $ocLazyLoad.load('js/controllers/file-upload.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.form.imagecrop', {
                  url: '/imagecrop',
                  templateUrl: 'tpl/form_imagecrop.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad){
                          return $ocLazyLoad.load('ngImgCrop').then(
                              function(){
                                 return $ocLazyLoad.load('js/controllers/imgcrop.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.form.select', {
                  url: '/select',
                  templateUrl: 'tpl/form_select.html',
                  controller: 'SelectCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('ui.select').then(
                              function(){
                                  return $ocLazyLoad.load('js/controllers/select.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.form.slider', {
                  url: '/slider',
                  templateUrl: 'tpl/form_slider.html',
                  controller: 'SliderCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('vr.directives.slider').then(
                              function(){
                                  return $ocLazyLoad.load('js/controllers/slider.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.form.editor', {
                  url: '/editor',
                  templateUrl: 'tpl/form_editor.html',
                  controller: 'EditorCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('textAngular').then(
                              function(){
                                  return $ocLazyLoad.load('js/controllers/editor.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.form.xeditable', {
                  url: '/xeditable',
                  templateUrl: 'tpl/form_xeditable.html',
                  controller: 'XeditableCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('xeditable').then(
                              function(){
                                  return $ocLazyLoad.load('js/controllers/xeditable.js');
                              }
                          );
                      }]
                  }
              })
              // pages
              .state('app.page', {
                  url: '/page',
                  template: '<div ui-view class="fade-in-down"></div>'
              })
              .state('app.page.profile', {
                  url: '/profile',
                  templateUrl: 'tpl/page_profile.html'
              })
              .state('app.page.post', {
                  url: '/post',
                  templateUrl: 'tpl/page_post.html'
              })
              .state('app.page.search', {
                  url: '/search',
                  templateUrl: 'tpl/page_search.html'
              })
              .state('app.page.invoice', {
                  url: '/invoice',
                  templateUrl: 'tpl/page_invoice.html'
              })
              .state('app.page.price', {
                  url: '/price',
                  templateUrl: 'tpl/page_price.html'
              })
              .state('app.docs', {
                  url: '/docs',
                  templateUrl: 'tpl/docs.html'
              })
              // others
              .state('lockme', {
                  url: '/lockme',
                  templateUrl: 'tpl/page_lockme.html'
              })
              .state('access', {
                  url: '/access',
                  template: '<div ui-view class="fade-in-right-big smooth"></div>'
              })
              .state('access.signin', {
                  url: '/signin',
                  templateUrl: 'tpl/page_signin.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/controllers/signin.js'] );
                      }]
                  }
              })
              .state('access.signup', {
                  url: '/signup',
                  templateUrl: 'tpl/page_signup.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/controllers/signup.js'] );
                      }]
                  }
              })
              .state('access.forgotpwd', {
                  url: '/forgotpwd',
                  templateUrl: 'tpl/page_forgotpwd.html'
              })
              .state('access.404', {
                  url: '/404',
                  templateUrl: 'tpl/page_404.html'
              })

              // fullCalendar
              .state('app.calendar', {
                  url: '/calendar',
                  templateUrl: 'tpl/app_calendar.html',
                  // use resolve to load other dependences
                  resolve: {
                      deps: ['$ocLazyLoad', 'uiLoad',
                        function( $ocLazyLoad, uiLoad ){
                          return uiLoad.load(
                            JQ_CONFIG.fullcalendar.concat('js/app/calendar/calendar.js')
                          ).then(
                            function(){
                              return $ocLazyLoad.load('ui.calendar');
                            }
                          )
                      }]
                  }
              })

              // mail
              .state('app.mail', {
                  abstract: true,
                  url: '/mail',
                  templateUrl: 'tpl/mail.html',
                  // use resolve to load other dependences
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/app/mail/mail.js',
                                               'js/app/mail/mail-service.js',
                                               JQ_CONFIG.moment] );
                      }]
                  }
              })
              .state('app.mail.list', {
                  url: '/inbox/{fold}',
                  templateUrl: 'tpl/mail.list.html'
              })
              .state('app.mail.detail', {
                  url: '/{mailId:[0-9]{1,4}}',
                  templateUrl: 'tpl/mail.detail.html'
              })
              .state('app.mail.compose', {
                  url: '/compose',
                  templateUrl: 'tpl/mail.new.html'
              })

              .state('layout', {
                  abstract: true,
                  url: '/layout',
                  templateUrl: 'tpl/layout.html'
              })
              .state('layout.fullwidth', {
                  url: '/fullwidth',
                  views: {
                      '': {
                          templateUrl: 'tpl/layout_fullwidth.html'
                      },
                      'footer': {
                          templateUrl: 'tpl/layout_footer_fullwidth.html'
                      }
                  },
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/controllers/vectormap.js'] );
                      }]
                  }
              })
              .state('layout.mobile', {
                  url: '/mobile',
                  views: {
                      '': {
                          templateUrl: 'tpl/layout_mobile.html'
                      },
                      'footer': {
                          templateUrl: 'tpl/layout_footer_mobile.html'
                      }
                  }
              })
              .state('layout.app', {
                  url: '/app',
                  views: {
                      '': {
                          templateUrl: 'tpl/layout_app.html'
                      },
                      'footer': {
                          templateUrl: 'tpl/layout_footer_fullwidth.html'
                      }
                  },
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/controllers/tab.js'] );
                      }]
                  }
              })
              .state('apps', {
                  abstract: true,
                  url: '/apps',
                  templateUrl: 'tpl/layout.html'
              })
              .state('apps.note', {
                  url: '/note',
                  templateUrl: 'tpl/apps_note.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/app/note/note.js',
                                               JQ_CONFIG.moment] );
                      }]
                  }
              })
              .state('apps.contact', {
                  url: '/contact',
                  templateUrl: 'tpl/apps_contact.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/app/contact/contact.js'] );
                      }]
                  }
              })
              .state('app.weather', {
                  url: '/weather',
                  templateUrl: 'tpl/apps_weather.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load(
                              {
                                  name: 'angular-skycons',
                                  files: ['js/app/weather/skycons.js',
                                          'js/app/weather/angular-skycons.js',
                                          'js/app/weather/ctrl.js',
                                          JQ_CONFIG.moment ]
                              }
                          );
                      }]
                  }
              })
              .state('app.todo', {
                  url: '/todo',
                  templateUrl: 'tpl/apps_todo.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/app/todo/todo.js',
                                               JQ_CONFIG.moment] );
                      }]
                  }
              })
              .state('app.todo.list', {
                  url: '/{fold}'
              })
              .state('music', {
                  url: '/music',
                  templateUrl: 'tpl/music.html',
                  controller: 'MusicCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load([
                            'com.2fdevs.videogular',
                            'com.2fdevs.videogular.plugins.controls',
                            'com.2fdevs.videogular.plugins.overlayplay',
                            'com.2fdevs.videogular.plugins.poster',
                            'com.2fdevs.videogular.plugins.buffering',
                            'js/app/music/ctrl.js',
                            'js/app/music/theme.css'
                          ]);
                      }]
                  }
              })
                .state('music.home', {
                    url: '/home',
                    templateUrl: 'tpl/music.home.html'
                })
                .state('music.genres', {
                    url: '/genres',
                    templateUrl: 'tpl/music.genres.html'
                })
                .state('music.detail', {
                    url: '/detail',
                    templateUrl: 'tpl/music.detail.html'
                })
                .state('music.mtv', {
                    url: '/mtv',
                    templateUrl: 'tpl/music.mtv.html'
                })
                .state('music.mtvdetail', {
                    url: '/mtvdetail',
                    templateUrl: 'tpl/music.mtv.detail.html'
                })
                .state('music.playlist', {
                    url: '/playlist/{fold}',
                    templateUrl: 'tpl/music.playlist.html'
                })

      }
    ]

  );

