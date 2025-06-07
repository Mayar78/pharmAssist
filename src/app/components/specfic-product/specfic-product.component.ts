import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { ToastrService } from 'ngx-toastr';
import { Iproduct } from '../../core/interfaces/iproduct';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-specfic-product',
  standalone: true,
  imports: [CarouselModule , CurrencyPipe],
  templateUrl: './specfic-product.component.html',
  styleUrl: './specfic-product.component.css'
})
export class SpecficProductComponent {
detailsSlider: OwlOptions = {
    autoplay:true,
    autoplayTimeout:1000,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: false,
  }
  constructor(private _ProductService:ProductsService,   
  ){}
  private readonly _ar = inject(ActivatedRoute);
  private readonly _ToastrService = inject(ToastrService);

  
  productId!:string|null;
  detailsData:Iproduct | null = null;
  // whishlistData!: Iwishlist[];
    whishlistIds!: string[];

  // addCart(id:string):void{
  //   this._CartService.addProductToCart(id).subscribe({
  //     next:(res)=>{
  //       this._ToastrService.success(res.message, 'Success')
  //       console.log(res);
  //    },
  //    error:(err)=>{console.log(err);
  //    },
  //   })
  // }
  ngOnInit(): void {
    this._ar.paramMap.subscribe({
      next:(pInfo)=>{console.log(pInfo.get('PId'));
      this.productId=pInfo.get('PId')
      }
    })

    // this._WishlistService.getWishlist().subscribe({
    //   next: (res) => {
    //     this.whishlistData = res.data;
    //     this.whishlistIds = this.whishlistData.map((item) => item._id);
    //   },
    // });
    this._ProductService.getProductDetails(this.productId).subscribe({
      next:(res)=>{console.log("data",res);
      this.detailsData = res;
      },
      error:(err)=>{console.log(err);
      }
    })
  }

  // addToWishlist(p_id: string) {
  //   this._WishlistService.addProductToWishlist(p_id).subscribe({
  //     next: (res) => {
  //       this._ToastrService.success(res.message, 'Success');
  //       this.whishlistIds = res.data;
  //     },
  //   })
  // }
  // removeFromWishlist(p_id: string) {
  //   this._WishlistService.removeItemFromWishlist(p_id).subscribe({
  //     next: (res) => {
  //       this._ToastrService.success(res.message, 'Success');
  //       this.whishlistIds = res.data;
  //     },
  //   });
  // }

  // isProductInWishlist(productId: string): boolean {
  //   return this.whishlistIds.includes(productId);}

}
