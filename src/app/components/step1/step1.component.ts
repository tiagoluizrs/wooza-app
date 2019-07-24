import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Serviços próprios do projeto
import { SeoService } from '../../services/Seo/seo.service';
import { HttpService } from '../../services/Http/http.service';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.sass']
})
export class Step1Component implements OnInit {
  loginForm: FormGroup;
  returnUrl: string;

  // Boleanos que realizam verificação no component html
  submitted: boolean = false;
  hide_preload_state: boolean = false;
  hide_preload_city: boolean = true;
  connection_lost: boolean = false;
  initDisabled: boolean = true;
  planSelected: object = null;
  
  constructor(
    private seoService: SeoService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ){
    this.seoService.setTitlePage('Wooza - Envio de dados');
    this.setMetaTag();
  }

  ngOnInit() {
    this.initForm();
    this.initDisabled = false;

    this.route.queryParams.subscribe(params => {
      this.planSelected = {
        "sku": params.sku,
        "franquia": params.franquia,
        "plataforma": params.plataforma
      }

      if(params.aparelho_nome != undefined){
        this.planSelected["aparelho"] = {
          "nome": params.aparelho_nome,
          "valor": params.aparelho_valor,
          "numeroParcelas": params.aparelho_numeroParcelas,
          "valorParcela": params.aparelho_valorParcela
        }
      }
    });
  }


  /* Método que usamos para inicializar nosso grupo de itens do formulário.
    Nele passamos as validações de required dos campos e patterns quando houverem.

    Patterns:
    E-mail: Foi adicionado uma exigência no campo de e-mail para que contenha o formado de e-mail. Ex: email@email.com
    CPF: No CPF foi adicionado a exigência de ter exatamente 11 números.
    Birthday: Na data de nascimento foi adicionado a exigência de ter exatamente 8 dígitos.
    Celular: No celular foi adicionado a exigência de ter código de área e seus 9 dígitos.

    Esses patterns forçam o usuário a preecher os dados corretamente, além dos patterns o html também possui
    máscaras que auxiliam o usuário no momento do preenchimento.
  */
  initForm(){
    this.loginForm = this.formBuilder.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.pattern(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i)]],
        cpf: ['', [Validators.required, Validators.pattern(/^\w{11,11}$/)]],
        birthday: ['', [Validators.required, Validators.pattern(/^\w{8,8}$/)]],
        phone: ['', [Validators.required, Validators.pattern(/^[1-9]{2}[9]{0,1}[6-9]{1}[0-9]{3}[0-9]{4}$/)]],
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  /*
    Método get que usamos para pegar um valor specífico do formulário.
    Exemplo:
    Ao invés de fazermos 
    this.loginForm.controls.name.value
    
    Com esse método precisaremos fazer apenas this.f.name.value
    A legibilidade fica bem melhor.
  */
  get f() { return this.loginForm.controls; }

  /*
    Aqui é onde realizamos o submit.

    Os dados são capturados, alguns deles como birthday passam por uma formatação, mas nada difícil.

    Esse método captura os valores preenchidos no formulário e se todos os dados forem preenchidos
    corretamente ele estará apto para realizar o submit que levará o usuário para a pŕoxima página que é
    a step2 (/cadastro-concluido), uma página de mensagem onde o usuário terá a confirmação do cadastro.
  */
  onSubmit() {
    let cpf: string = this.f.cpf.value;
    let birthday: string = this.f.birthday.value;

    // Formatação do birthday para 00/00/0000, pois a máscara do front-end não preserva as barras/
    birthday = `${birthday[0]}${birthday[1]}/${birthday[2]}${birthday[3]}/${birthday[4]}${birthday[5]}${birthday[6]}${birthday[7]}`;
    
    this.submitted = true;

    if (this.loginForm.invalid) {
        return;
    }

    console.log({
      "dados_cliente":{
        'name': this.f.name.value,
        'email': this.f.email.value,
        'cpf': cpf,
        'birthday': birthday,
        'phone': this.f.phone.value
      },
      "dados_plano": this.planSelected
    })
    this.router.navigate(['/cadastro-concluido'], { queryParams:  { step2_enabled: true }, skipLocationChange: true});
  }

  setMetaTag(): void{
    let metatags = [
      {charset: 'UTF-8'},
      {httpEquiv: 'Content-Type', content: 'text/html'},
      {httpEquiv: 'X-UA-Compatible', content: 'IE=edge,chrome=1, minimum-scale=1'},
      {name: 'description', content: 'Conheça uma de nossas platformas agora!'},   
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},   
      {name: 'author', content: 'Wooza'},
      {name: 'keywords', content: 'Planos, Internet, 4G, Wi-fi'},
      {name: 'theme-color', content: '#333'},
      {name: 'application-name', content: 'Conheça os planos da wooza'},
      {name: 'robots', content: 'index,follow'},
      {property: 'og:url', content: "http://wooza-app.herokuapp.com/"},
      {property: 'og:title', content: "Conheça os planos da wooza - Enviar dados"},
      {property: 'og:description', content: "Conheça uma de nossas platformas agora!"},
      {property: 'og:type', content: "website"},
      {property: 'og:site_name', content: "Contrate um plano na Wooza"},
      {property: 'og:locale', content: "pt_BR"},
    ];  

    for(let metatag of metatags){
      this.seoService.updateMetaTags(metatag)
    }
  }
}
