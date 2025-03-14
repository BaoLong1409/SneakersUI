import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { PaymentService } from '../../../core/services/payment.service';
import { PaymentDto } from '../../../core/dtos/payment.dto';
import { OrderService } from '../../../core/services/order.service';
import { OrderDetailDto } from '../../../core/dtos/orderDetail.dto';
import { ActivatedRoute } from '@angular/router';
import { CommonRes } from '../../../core/dtos/Response/commonRes';
import { MessageService } from 'primeng/api';
import { ToastService } from '../../../core/services/toast.service';
import { ToastModule } from 'primeng/toast';
import { UpdateOrderReq } from '../../../core/dtos/Request/updateOrderReq';
import { CommonService } from '../../../core/services/common.service';

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
    AutoCompleteModule,
    ToastModule
  ],
  providers: [
    MessageService,
    ToastService
  ],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrderComponent extends BaseComponent implements OnInit, AfterViewInit {
  public province: string = "";
  public district: string = "";
  public ward: string = "";

  public shippingSelected!: ShippingMethodDto;
  public paymentSelected!: PaymentDto;
  public provincesName: string[] = [];
  public districtsName: string[] = [];
  public wardsName: string[] = [];
  public shippingMethods: ShippingMethodDto[] = [];
  public paymentMethods: PaymentDto[] = [];
  public orderDetails: OrderDetailDto[] = [];
  public totalOrderMoney: number = 0;

  private provinces!: ProvinceApi;
  private districts!: DistrictApi;
  private wards!: WardApi;


  private provinceId!: string;
  private districtId!: string;
  private orderId!: string;

  public orderForm: FormGroup;
  constructor(
    private readonly publicAddressService: PublicAddressService,
    private readonly shippingService: ShippingService,
    private readonly paymentService: PaymentService,
    private readonly orderSerivce: OrderService,
    private readonly toastService: ToastService,
    private readonly commonService: CommonService,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute
  ) {
    super();
    this.orderForm = this.fb.group({
      fullName: [, Validators.required],
      phoneNumber: [, Validators.required],
      shippingAddress: [, Validators.required],
      shippingDate: [],
      totalMoney: [, Validators.required],
      noteOrder: [],
      noteAddress: [],
      shippingId: [, Validators.required],
      shippingInforId: [],
      paymentId: [, Validators.required]
    });
  }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id') ?? "";

    this.shippingService.getAllShippingMethods().pipe(
      tap((sMethods: ShippingMethodDto[]) => {
        this.shippingMethods = sMethods;
      }),
      takeUntil(this.destroyed$)
    ).subscribe();

    this.paymentService.getAllPayments().pipe(
      tap((paymentMethods: PaymentDto[]) => {
        this.paymentMethods = paymentMethods;
      }),
      takeUntil(this.destroyed$)
    ).subscribe();

    this.orderSerivce.getOrderDetails(this.orderId).pipe(
      tap((orderDetails: OrderDetailDto[]) => {
        this.orderDetails = orderDetails;
        this.totalOrderMoney = orderDetails.reduce((sum, order) => sum + (order.priceAtOrder * order.quantity), 0);
      }),
      takeUntil(this.destroyed$)
    ).subscribe();
  }

  ngAfterViewInit(): void {
    
  }

  public toggleShippingSelection(shipping: ShippingMethodDto): void {
    this.shippingSelected = shipping;
  }

  public togglePaymentSelection(payment: PaymentDto): void {
    this.paymentSelected = payment;
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

  onEnter(event: Event) {
    if (!this.provincesName.includes(this.province)) {
      event.preventDefault();
    }
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

  public ConfirmOrder() {
    if (this.orderForm.valid && this.paymentSelected.name == "COD") {
      this.updateOrderInfo();
    } else if (this.orderForm.valid && this.paymentSelected.name == "VNPay") {
      this.updateOrderInfo();
      
      this.orderSerivce.payVnpay(this.orderId).pipe(
        tap((vnPayLink: { url: string }) => {
          window.location.href = vnPayLink.url
        }),
        takeUntil(this.destroyed$)
      ).subscribe();
    }
  }

  private updateOrderInfo() {
    this.orderForm.patchValue ({
      shippingAddress: `${this.ward} - ${this.district} - ${this.province} - ${this.orderForm.value.noteAddress}`,
      shippingDate: new Date(),
      totalMoney: this.totalOrderMoney,
      shippingId: this.shippingSelected.id,
      paymentId: this.paymentSelected.id
    });

    const updateOrderReq: UpdateOrderReq = Object.assign({}, this.orderForm.value, {
      orderId: this.orderId,
      orderDate: new Date(),
      userId: this.commonService.userInfor.id,
      note: this.orderForm.value.noteOrder || null
    });

    this.orderSerivce.updateOrder(updateOrderReq).pipe(
      tap((res: CommonRes) => {
        // this.toastService.success(res.message);
      }),
      takeUntil(this.destroyed$)
    ).subscribe();
  }
}