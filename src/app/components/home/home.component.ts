import { Component, OnInit } from '@angular/core';
import { Observable, interval, throwError, of,  } from 'rxjs';
import { Router } from '@angular/router';
import { retryWhen, flatMap } from 'rxjs/operators';

// Serviços próprios do projeto
import { SeoService } from '../../services/Seo/seo.service';
import { HttpService } from '../../services/Http/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})

export class HomeComponent implements OnInit {
  platforms: Observable<Array<any>>;
  plans: Observable<Array<any>>;
  slideConfig: any;
  hide_preload_platforms: boolean = false;
  hide_preload_plans: boolean = true;
  hide_plans: boolean = true

  constructor(
    private seoService: SeoService,
    private httpService: HttpService,
    private router: Router
  ){
    this.initializeCarousel(3);
    this.seoService.setTitlePage('Wooza - Início');
    this.setMetaTag();
  } 

  ngOnInit() {
    this.getPlatforms();
    this.plans = null
  }

  /*
    Método que usamos para pegar as plataformas que serão exibidas no carousel.
    Formato do dado retornado.
    Um array com vários objetos dentro: [{"sku": "TBT01", "nome": "Tablet", "descricao": "Chip para..." ...}, ...]

    O método possui o retryWhen que no caso de uma tentativa de requisição não ser bem-sucedida,
    ele tentará a cada 3 segundos requisitar novamente a solicitação, após 10 tentativas ele irá informar
    ao usuário que provavelmente a conexão dele pode estar com problemas.

    Obs: O número de tentativas que no caso são 10 não contam com a primeira tentativa, sendo o total de
    11 tentativas.

    O mesmo método também pegará o primeiro file do slide e colocará sua imagem como imagem do banner principal.
  */
  getPlatforms(): void{
    let headers = {
      'Content-Type': 'application/json'
    }

    this.httpService.get("https://demo3127152.mockable.io/platforms", headers)
    .pipe(retryWhen(_ => {
      return interval(3000).pipe(
        flatMap(count => count == 10 ? throwError('Número de tentativas excedido. Verifique sua conexão e tente novamente.') : of(count))
      )
    }))
    .subscribe((data: any) => {
      this.platforms = data["plataformas"];
      this.hide_preload_platforms = true;
    },(error) => {
        if(error == 'Número de tentativas excedido. Verifique sua conexão e tente novamente.'){
          alert(error);
        }
        this.platforms = null;
        this.hide_preload_platforms = true;
        console.log(`[[HomeComponent | getPlatforms]] >> Um erro ocorreu durante o carregamento das plataformas. Descrição do erro: ${error}`);
      }
    );
  }

  // TODO - Adicionar descrição do método
  KeyToFind(obj, key){
    return key in obj;  
  }
  
  // TODO - Adicionar descrição do método
  getPlans(platform:string): void{
    this.plans = null;

    let headers = {
      'Content-Type': 'application/json'
    }
    this.hide_preload_plans = false

    this.httpService.get(`https://demo3127152.mockable.io/${platform}`, headers)
    .pipe(retryWhen(_ => {
      return interval(3000).pipe(
        flatMap(count => count == 10 ? throwError('Número de tentativas excedido. Verifique sua conexão e tente novamente.') : of(count))
      )
    }))
    .subscribe((data: any) => {
      this.plans = data["planos"];
      this.initializeCarousel(5);
      this.hide_preload_plans = true
      this.hide_plans = false
    },(error) => {
        if(error == 'Número de tentativas excedido. Verifique sua conexão e tente novamente.'){
          alert(error);
        }
        this.plans = null;
        this.hide_preload_plans = true
        this.hide_plans = false
        console.log(`[[HomeComponent | getPlatforms]] >> Um erro ocorreu durante o carregamento das plataformas. Descrição do erro: ${error}`);
      }
    );
  }
 
  // TODO -  Adicionar descrição do método
  sendData(plan_selected:any): void{
    this.router.navigate(['/enviar-dados'], { queryParams:  { plan: plan_selected }, skipLocationChange: true});
  }

  /* Esse é o método que detecta o carregamento do carousel. Nele selecionamos a plataforma 
    intermediária para ficar como a selecionada ao centro.
  */
  slickInit(e): void{
    try{
      e.slickGoTo(1)
    }catch(error){
      setTimeout(function(){
        e.slickGoTo(1)
      }, 1000)
    }
  }

  // Esse é o método que usamos para passar todas as configurações do carousel.
  initializeCarousel(slidesToShow): void{
    this.slideConfig = {
      "arrows": false,
      "dots": false,
      "infinite": false,
      "centerMode": false,
      "centerPadding": '20px',
      "variableWidth": false,
      "slidesToShow": slidesToShow,
      "focusOnSelect": true,
      "responsive": [
        // {
        //   "breakpoint": 1000,
        //   "settings": {
        //     "centerPadding": '60px',
        //     "slidesToShow": 3,
        //     "centerMode": true,
        //     "infinite": true,
        //     "focusOnSelect": true
        //   }
        // },
        {
          "breakpoint": 500,
          "settings": {
            "dots": true,
            "centerPadding": '60px',
            "slidesToShow": 1,
            "centerMode": true,
            "infinite": true,
            "focusOnSelect": true
          }
        }
      ]
    } 
  }

  setMetaTag(): void{
    let metatags = [
      {charset: 'UTF-8'},
      {httpEquiv: 'Content-Type', content: 'text/html'},
      {httpEquiv: 'X-UA-Compatible', content: 'IE=edge,chrome=1, minimum-scale=1'},
      {name: 'description', content: 'Conheça um de nossos platformos agora!'},   
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},   
      {name: 'author', content: 'wooza'},
      {name: 'keywords', content: 'Planos de internet 4G e Wi-fi'},
      {name: 'theme-color', content: '#333'},
      {name: 'application-name', content: 'Conheça os planos da wooza'},
      {name: 'robots', content: 'index,follow'},
      {property: 'og:url', content: "http://wooza-app.herokuapp.com/"},
      {property: 'og:title', content: "Conheça os planos da wooza"},
      {property: 'og:description', content: "Conheça um de nossos platformos agora!"},
      {property: 'og:type', content: "website"},
      {property: 'og:site_name', content: "Assina wooza Play"},
      {property: 'og:locale', content: "pt_BR"},
    ];

    for(let metatag of metatags){
      this.seoService.updateMetaTags(metatag)
    }
  }
}
