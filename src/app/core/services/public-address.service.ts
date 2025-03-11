import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProvinceApi } from '../dtos/AddressApiType/provinceApi';
import { DistrictApi } from '../dtos/AddressApiType/DistrictApi';
import { WardApi } from '../dtos/AddressApiType/WardApi';

@Injectable({
  providedIn: 'root'
})
export class PublicAddressService {

  constructor(
    private readonly httpClient: HttpClient
  ) { }

  public GetProvinces(character: string) {
    return this.httpClient.get<ProvinceApi>(`https://open.oapi.vn/location/provinces?query=${character}`);
  }

  public GetDistricts(character: string, provinceId: string) {
    return this.httpClient.get<DistrictApi>(`https://open.oapi.vn/location/districts/${provinceId}?query=${character}`);
  }

  public GetWards(character: string, districtId: string) {
    return this.httpClient.get<WardApi>(`https://open.oapi.vn/location/wards/${districtId}?query=${character}`);
  }
}
