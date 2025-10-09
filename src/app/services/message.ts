import { inject, Injectable } from '@angular/core';
import { MessageService, ToastMessageOptions } from 'primeng/api';

type ToastMessageOptionsReduced = Omit<
  ToastMessageOptions,
  'id' | 'key' | 'closable' | 'data' | 'contentStyleClass' | 'styleClass' | 'closeIcon'
>;
type ToastMessageOptionsReducedSeverity = Omit<
  ToastMessageOptionsReduced,
  'icon' | 'severity'
>;
@Injectable({
  providedIn: 'root',
})
export class Message {
  private messageService = inject(MessageService);

  add(toastMessageOptionsReduced: ToastMessageOptionsReduced|ToastMessageOptionsReducedSeverity) {
    this.messageService.add({
      life: 4000,
      key: 'toast',
      closable: true,
      ...toastMessageOptionsReduced,
    });
  }
  clear(){
    this.messageService.clear();
  }
  success(toastMessageOptionsReducedSeverity: ToastMessageOptionsReducedSeverity) {
    this.add({
      severity: 'success',
      ...toastMessageOptionsReducedSeverity,
    });
  }
  info(toastMessageOptionsReducedSeverity: ToastMessageOptionsReducedSeverity) {
    this.add({
      severity: 'info',
      ...toastMessageOptionsReducedSeverity,
    });
  }
  warn(toastMessageOptionsReducedSeverity: ToastMessageOptionsReducedSeverity) {
    this.add({
      severity: 'warn',
      ...toastMessageOptionsReducedSeverity,
    });
  }
  error(toastMessageOptionsReducedSeverity: ToastMessageOptionsReducedSeverity) {
    this.add({
      severity: 'error',
      ...toastMessageOptionsReducedSeverity,
    });
  }
  constrat(toastMessageOptionsReducedSeverity: ToastMessageOptionsReducedSeverity) {
    this.add({
      severity: 'constrat',
      ...toastMessageOptionsReducedSeverity,
    });
  }
  secondary(toastMessageOptionsReducedSeverity: ToastMessageOptionsReducedSeverity) {
    this.add({
      severity: 'secondary',
      ...toastMessageOptionsReducedSeverity,
    });
  }
}
