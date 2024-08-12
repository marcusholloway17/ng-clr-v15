import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxClrFormControlModule } from '@azlabsjs/ngx-clr-form-control';
import { NgxClrSmartGridModule } from '@azlabsjs/ngx-clr-smart-grid';
import { NgxCommonModule } from '@azlabsjs/ngx-common';
import { NgxSmartFormModule } from '@azlabsjs/ngx-smart-form';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { DataDetailModule } from './modules/components/data';
import { FORM_MODAL_DIRECTIVES } from './modules/components/form-modal';
import { TOPBAR_DIRECTIVES } from './modules/components/header';
import { HEADER_ACTIONS_DIRECTIVES } from './modules/components/header-actions';
import { HEADER_LINKS_DIRECTIVES } from './modules/components/header-links';
import { VIEW_DIRECTIVES } from './modules/components/view';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ClarityModule,
    NgxClrSmartGridModule,
    TranslateModule,
    NgxCommonModule,
    DataDetailModule,
    NgxSmartFormModule,
    NgxClrFormControlModule,
    ...TOPBAR_DIRECTIVES,
    ...HEADER_ACTIONS_DIRECTIVES,
    ...HEADER_LINKS_DIRECTIVES,
    ...FORM_MODAL_DIRECTIVES,
    ...VIEW_DIRECTIVES,
  ],
  exports: [
    CommonModule,
    ClarityModule,
    NgxClrSmartGridModule,
    TranslateModule,
    NgxCommonModule,
    DataDetailModule,
    NgxSmartFormModule,
    NgxClrFormControlModule,
    ...TOPBAR_DIRECTIVES,
    ...HEADER_ACTIONS_DIRECTIVES,
    ...HEADER_LINKS_DIRECTIVES,
    ...FORM_MODAL_DIRECTIVES,
    ...VIEW_DIRECTIVES,
  ],
})
export class SharedModule {}
