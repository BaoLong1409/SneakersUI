import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from 'primeng/basecomponent';
import { FeatureProductDto } from '../../../core/dtos/featureProduct.dto';
import { CommonModule } from '@angular/common';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { tap } from 'rxjs';
import { AllProductDto } from '../../../core/dtos/allProduct.dto';
import { UserDto } from '../../../core/dtos/user.dto';
import { DataViewModule } from 'primeng/dataview';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RatingModule,
    FormsModule,
    DataViewModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent extends BaseComponent implements OnInit {
  public homeStyle = {};

  public featureProducts: FeatureProductDto[] = [];
  public featureProductSelectd!: FeatureProductDto;
  public recommendationProducts: AllProductDto[] = [];
  public initIndex: number = 0;
  private userInfor!: UserDto;

  constructor(private productService: ProductService) {
    super();
    if (typeof localStorage != 'undefined') {
      const userInfor = localStorage.getItem("userInfor");
      this.userInfor = userInfor ? JSON.parse(userInfor) : {} as UserDto;
    }
  }

  override ngOnInit(): void {
    this.productService
      .getAllFeatureProducts()
      .pipe(
        tap((featureProducts: FeatureProductDto[]) => {
          this.featureProducts = featureProducts;
          this.featureProductSelectd = this.featureProducts[this.initIndex];
          this.homeStyle = {
            background: `linear-gradient(45deg, ${this.featureProductSelectd.leftColor}, ${this.featureProductSelectd.middleColor}, ${this.featureProductSelectd.rightColor})`,
          };
        })
      )
      .subscribe();

      this.productService.getRecommendProducts(this.userInfor.id).pipe(
        tap((recommendProducts: AllProductDto[]) => {
          this.recommendationProducts = recommendProducts;
          console.log(this.recommendationProducts);
        })
      )
      .subscribe();
  }

  public nextFeatureProduct() {
    this.initIndex = (this.initIndex + 1) % this.featureProducts.length;
    this.featureProductSelectd = this.featureProducts[this.initIndex];
    this.homeStyle = {
      background: `linear-gradient(45deg, ${this.featureProductSelectd.leftColor}, ${this.featureProductSelectd.middleColor}, ${this.featureProductSelectd.rightColor})`,
    };
  }

  public prevFeatureProduct() {
    this.initIndex =
      (this.initIndex - 1 + this.featureProducts.length) %
      this.featureProducts.length;
    this.featureProductSelectd = this.featureProducts[this.initIndex];
    this.homeStyle = {
      background: `linear-gradient(45deg, ${this.featureProductSelectd.leftColor}, ${this.featureProductSelectd.middleColor}, ${this.featureProductSelectd.rightColor})`,
    };
  }

  get nextIndex() {
    return (this.initIndex + 1) % this.featureProducts.length;
  }

  get prevIndex() {
    return (
      (this.initIndex - 1 + this.featureProducts.length) %
      this.featureProducts.length
    );
  }
}
