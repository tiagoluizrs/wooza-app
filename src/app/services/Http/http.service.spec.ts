import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { HttpService } from './http.service';

describe('HttpService', () => {
  let httpService: HttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpService]
    });
    httpService = TestBed.get(HttpService);
    httpMock = TestBed.get(HttpTestingController);
  });
  

  /*
    Apenas para testar se o método get está funcionando.
  */
  it('Verificando requisição ao endpoint de plataformas', ()=> {
    let headers = {
      'Content-Type': 'application/json'
    }
    httpService.get("http://private-59658d-celulardireto2017.apiary-mock.com/plataformas", headers).subscribe((data: any) => {
      let platforms = expect(Object.keys(data[0]))
      
      platforms.toContain("plataformas");
      platforms.toContain("sku");
      platforms.toContain("nome");
      platforms.toContain("descricao");
    });
  });
});
