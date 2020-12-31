// import { Injectable } from '@angular/core';
// import { forkJoin, Observable, of, throwError, throwError as _throw } from 'rxjs';
// import { catchError, switchMap, tap } from 'rxjs/operators';
// import { AuthService } from '../account/auth.service';
// import { UserService } from '../account/user.service';
// import { AddressService } from '../address/address.service';
// import { DraftService } from '../draft/draft.service';
// import { ImageGalleryService } from '../image-gallery/image-gallery.service';
// import { OrderService } from '../order/order.service';
// import { SaleService } from '../payment/sale.service';
// import { ProductService } from '../product/product.service';
// import { SubscriptionService } from '../subscription/services/subscription.service';
// import { ApiService } from './api.service';
// import { BrazeService } from './braze.service';
// import { DebugService } from './debug.service';
// import { DeviceService } from './device.service';
// import { EventManager } from './event-manager.service';
// import { LocalizationService } from './localization.service';
// import { MigrationService } from './migration.service';
// import { TrackerService } from './tracker.service';
// import { UniversalConfigService } from './universal-config.service';
// import { CreditLogService } from '../account/credit-log.service';
// import { LeanplumService } from './leanplum.service';
// import { ExperimentsService } from './experiments.service';
// import { ConfigService } from './config.service';

// @Injectable()
// export class Initializer {
//   constructor(
//     private deviceService: DeviceService,
//     private apiService: ApiService,
//     private authService: AuthService,
//     private userService: UserService,
//     private productService: ProductService,
//     private event: EventManager,
//     private draftService: DraftService,
//     private galleryService: ImageGalleryService,
//     private subscriptionService: SubscriptionService,
//     private tracker: TrackerService,
//     private addressService: AddressService,
//     private debugService: DebugService,
//     private universalConfigService: UniversalConfigService,
//     private migrationService: MigrationService,
//     private localizationService: LocalizationService,
//     private orderService: OrderService,
//     private braze: BrazeService,
//     private saleService: SaleService,
//     private creditLogService: CreditLogService,
//     private leanplum: LeanplumService,
//     private experiments: ExperimentsService,
//     private configService: ConfigService
//   ) {
//     // console.debug('init -> Initializer');
//     this.addTrackingListeners();
//   }

//   init(): Observable<any> {
//     // erased local data when token is not valid anymore
//     // this.event.onUnauthorized.subscribe(() => {
//     // TODO: p4 need to handle virtual path reload issue?
//     // this.authService.logout();
//     // });

//     // initialize data when token exists
//     // (ngx-webstorage is not able to get local storage values atm)

//     return of(0).pipe(
//       switchMap(() => this.migrationService.init()),
//       switchMap(() => this.setupDeviceToken()),
//       switchMap(() => {
//         return forkJoin([
//           this.universalConfigService.init(),
//           this.productService.init(),
//           // this.subscriptionService.init(),
//           this.experiments.init(),
//           this.leanplum.init(),
//         ]);
//       }),
//       // switchMap(() => this.leanplum.init()),
//       switchMap(() => {
//         if (this.authService.isAuth()) {
//           return forkJoin([
//             this.userService.init(),
//             this.draftService.init(),
//             this.galleryService.init(),
//             // this.orderService.init(),
//             // this.addressService.syncAddresses(),
//             this.addressService.getAddresses(),
//             this.saleService.init(),
//             this.creditLogService.init(),
//             this.subscriptionService.init(),
//           ]);
//         } else {
//           return of(null);
//         }
//       }),
//       tap(() => {
//         this.localizationService.init();
//         if (this.userService.currentUser && this.configService.is4For99p) {
//           this.subscriptionService.set4For99PStrings(this.userService.currentUser.countryId);
//         }
//         // this.leanplum.init().subscribe();
//         this.braze.init().subscribe(); // async process no need to wait for complete
//         this.addressService.syncAddresses();
//       }),
//       catchError((err) => {
//         this.tracker.report(err, 'web app initialisation failed', 'error');
//         return _throw(err);
//       })
//       // switchMap(() => Observable.empty()), // debug delay
//       // switchMap(() => _throw('debug error')), // debug error
//     );
//   }

//   private addTrackingListeners() {
//     this.event.onPaymentSuccess.subscribe((res) => {
//       let productName;
//       const priceLabel = (res.price / 100).toFixed(2);

//       if (res.productId) {
//         const p = this.productService.getProductById(res.productId);
//         productName = 'CREDIT-' + p.handle + '-' + res.credits;
//       } else if (res.subscriptionId) {
//         const plan = this.subscriptionService.getPlan(res.subscriptionId);
//         productName = 'PLAN-' + plan.handle;
//       } else if (res.bundleId) {
//         productName = 'BUNDLE-' + res.credits;
//       }

//       this.tracker.dlPurchase(productName, priceLabel);
//     });
//   }

//   private setupDeviceToken(): Observable<any> {
//     if (!this.deviceService.deviceToken || !this.deviceService.deviceInfo) {
//       return this.deviceService.register();
//     } else {
//       return this.deviceService.updateAppVersion().pipe(
//         // return this.deviceService.updatePartnership().pipe(
//         catchError((err) => {
//           if (err && err.status === 500) {
//             return this.deviceService.register().pipe(
//               switchMap(() => this.authService.logout()),
//               switchMap(() => throwError('device token error, reloading app'))
//             );
//           } else {
//             return of(err);
//           }
//         })
//       );
//     }
//   }
// }
