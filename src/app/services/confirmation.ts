import { inject, Injectable } from '@angular/core';
import { ConfirmationService, Confirmation as confirmation } from 'primeng/api';
type ConfirmationReduced = Omit<
  confirmation,
  | 'key'
  | 'accept'
  | 'reject'
  | 'blockScroll'
  | 'dismissableMask'
  | 'defaultFocus'
  | 'acceptButtonStyleClass'
  | 'rejectButtonStyleClass'
  | 'acceptEvent'
  | 'rejectEvent'
  | 'acceptButtonProps'
  | 'rejectButtonProps'
  | 'closeButtonProps'
  | 'closable'
  | 'closeOnEscape'
>;

@Injectable({
  providedIn: 'root',
})
export class Confirmation {
  private confirmationService = inject(ConfirmationService);

  async confirm(confirmation:ConfirmationReduced): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      this.confirmationService.confirm({
        ...confirmation,
        accept: () => resolve(true),
        reject: () => resolve(false),
        key: 'confirmation',
        blockScroll: true,
        dismissableMask: false,
        defaultFocus: 'reject',
        closable:true,
        
      });
    });
  }
}
