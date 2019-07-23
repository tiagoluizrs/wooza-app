import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { SlickCarouselModule } from 'ngx-slick-carousel';

import { HttpClient, HttpHandler, HttpEvent, HttpEventType } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { HomeComponent } from './home.component';

import { HttpService } from '../../services/Http/http.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let compiled: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule, SlickCarouselModule ],
      declarations: [ HomeComponent ],
      providers: [
        HttpClient, 
        HttpHandler,
        HttpService,
        HttpTestingController
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    compiled = fixture.debugElement.nativeElement;
    
    component = fixture.componentInstance;
    component.ngOnInit();

    fixture.detectChanges();
  });

  it('Verificando textos e link do banner', () => {
    fixture.detectChanges();
    expect(compiled.querySelector('.content__banner--text-content h1').textContent.trim()).toEqual('Conheça uma de nossos planos agora!');
    expect(compiled.querySelector('.content__banner--text-content h2').textContent.trim()).toEqual('Temos planos para seu tablet, computador e para sua casa!!! Escolha o plano que cabe no seu bolso!');
  });

  it('Verificando textos das box de plataforma', () => {
    fixture.detectChanges();
    expect(compiled.querySelector('.platforms h2').textContent.trim()).toEqual('Selecione uma plataforma');
  });
});
