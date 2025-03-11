import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { StepsModule } from 'primeng/steps';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { BaseComponent } from '../../../core/commonComponent/base.component';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabel } from 'primeng/floatlabel';
import { CardModule } from 'primeng/card';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ProvinceApi } from '../../../core/dtos/AddressApiType/provinceApi';
import { DistrictApi } from '../../../core/dtos/AddressApiType/DistrictApi';
import { WardApi } from '../../../core/dtos/AddressApiType/WardApi';
import { PublicAddressService } from '../../../core/services/public-address.service';
import { takeUntil, tap } from 'rxjs';
import { ProvinceType } from '../../../core/dtos/AddressApiType/Province';
import { ShippingService } from '../../../core/services/shipping.service';
import { ShippingMethodDto } from '../../../core/dtos/shippingMethod.dto';

@Component({
  selector: 'app-order',
  imports: [
    StepsModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    RadioButtonModule,
    CheckboxModule,
    StepperModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    FloatLabel,
    CardModule,
    AutoCompleteModule
  ],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent extends BaseComponent implements OnInit, AfterViewInit {
  public province: string = "";
  public district: string = "";
  public ward: string = "";

  public shippingSelected: string = "";
  public paymentSelected: boolean = false;
  public provincesName: string[] = [];
  public districtsName: string[] = [];
  public wardsName: string[] = [];
  public shippingMethods: ShippingMethodDto[] = [];

  private provinces!: ProvinceApi;
  private districts!: DistrictApi;
  private wards!: WardApi;


  private provinceId!: string;
  private districtId!: string;

  public orderForm: FormGroup;
  constructor(
    private readonly publicAddressService: PublicAddressService,
    private readonly shippingService: ShippingService,
    private readonly fb: FormBuilder
  ) {
    super();
    this.orderForm = this.fb.group({
      fullName: [, Validators.required],
      phoneNumber: [, Validators.required],
      shippingAddress: [, Validators.required],
      shippingDate: Date.now,
      totalMoney: [, Validators.required],
      note: [],
      userId: [],
      shippingId: [, Validators.required],
      shippingInforId: [],
      paymentId: [, Validators.required]
    });
  }

  ngOnInit(): void {
    this.shippingService.getAllShippingMethods().pipe(
      tap((sMethods: ShippingMethodDto[]) => {
        this.shippingMethods = sMethods;
      }),
      takeUntil(this.destroyed$)
    ).subscribe();
  }

  ngAfterViewInit(): void {
    
  }

  public toggleShippingSelection(shippingName: string): void {
    this.shippingSelected = shippingName;
  }

  public togglePaymentSelection(): void {
    this.paymentSelected = !this.paymentSelected
  }

  public searchProvinces(event: AutoCompleteCompleteEvent) {
    this.publicAddressService.GetProvinces(event.query).pipe(
      tap((provinces: ProvinceApi) => {
        this.provinces = provinces;
        this.provincesName = provinces.data.map(prov => prov.name);
      }),
      takeUntil(this.destroyed$)
    ).subscribe();
  }

  public searchDistricts(event: AutoCompleteCompleteEvent) {
    this.provinceId = this.provinces.data.find(p => p.name == this.province)?.id || '';

    this.publicAddressService.GetDistricts(event.query, this.provinceId).pipe(
      tap((districts: DistrictApi) => {
        this.districts = districts;
        this.districtsName = districts.data.map(dis => dis.name);
      }),
      takeUntil(this.destroyed$)
    ).subscribe();
  }

  public searchWards(event: AutoCompleteCompleteEvent) {
    this.districtId = this.districts.data.find(p => p.name == this.district)?.id || '';

    this.publicAddressService.GetWards(event.query, this.districtId).pipe(
      tap((wadrs: WardApi) => {
        this.wardsName = wadrs.data.map(w => w.name);
      }),
      takeUntil(this.destroyed$)
    ).subscribe();
  }
}