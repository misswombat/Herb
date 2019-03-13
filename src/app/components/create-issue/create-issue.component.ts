import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

import { ProgressWizardStepConfig } from 'src/app/interfaces/progress-wizard-step-config';
import { CreateIssueModel } from 'src/app/models/create-issue-model';
import { IssueService } from 'src/app/services/issue.service';
import { UserAlertService } from 'src/app/services/user-alert.service';

@Component({
  selector: 'app-create-issue',
  templateUrl: './create-issue.component.html',
  styleUrls: ['./create-issue.component.scss']
})
export class CreateIssueComponent implements OnInit, OnDestroy {

  // IMPORTAT: DO NOT USE IN PRODUCTION
  // This is a prototype and viewchild here is used to show behaviour in prototype only.
  @ViewChild('child1') jqChild1: ElementRef;
  @ViewChild('child2') jqChild2: ElementRef;
  @ViewChild('child3') jqChild3: ElementRef;
  @ViewChild('child4') jqChild4: ElementRef;
  @ViewChild('child5') jqChild5: ElementRef;

  formSteps: ProgressWizardStepConfig[];
  parentHeight: string;
  shouldApplyShadowClass: boolean;
  currentStep: number; // Starts from 1
  userResponse: CreateIssueModel; // Form model

  private isEditForm: boolean;
  private idSub: any;

  constructor(private _issueService: IssueService,
    private _userAlertService: UserAlertService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {

    // Setup additional steps if this is an edit form
    this.idSub = this.route.params.subscribe(params => {
      this.isEditForm = !_.isNaN(+params['id']);
    });

    this.init();
  }

  ngOnDestroy() {
    this.idSub.unsubscribe();
  }

  @HostListener('window:scroll', ['$event']) onScrollEvent($event) {
    this.shouldApplyShadowClass = window.pageYOffset > 0;
  }

  onStepChange(step: number) {
    // Changed to a new step
    this.currentStep = step;
    this.userResponse.currentStep = step;
    this.setParentHeight();
    this.scrollToTop();
  }

  onNextClick() {
    this.nextStep();
  }

  onPreviousClick() {
    this.previousStep();
  }

  onSubmitClick() {
    this._issueService.deleteDraft();
    this._userAlertService.showToasterMessage('Issue has been successfully submitted');
  }

  onSaveAsDraftClick() {
    this.userResponse.currentStep = this.currentStep;
    this._issueService.saveDraft(this.userResponse);
    this._userAlertService.showToasterMessage('Form progress has been saved!');
  }

  onAminetSelected(value: string) {
    this.userResponse.legalEntity = value;
  }

  onSourceSystemSelected(value: string) {
    this.userResponse.originalDataSource = value;
  }

  onProductSelected(value: string) {
    this.userResponse.affectedProduct = value;
  }

  onQuantityChange(value: number) {
    this.userResponse.impactQuantity = value;
  }

  onHighLevelImpactSelected(value: string) {
    this.userResponse.highLevelImpact = value;
  }

  getAminets(): string[] {
    return this._issueService.getAminets();
  }

  getSourceSystems(): string[] {
    return this._issueService.getSourceSystems();
  }

  getProducts(): string[] {
    return this._issueService.getProducts();
  }

  getIssueRegions(): string[] {
    return this._issueService.getRegions();
  }

  getFrequency(): string[] {
    return this._issueService.getFrequency();
  }

  getInfrastructure(): string[] {
    return this._issueService.getInfrastructure();
  }

  getConventions(): any[] {
    return this._issueService.getConventions();
  }

  getDataSetSupportEmail(): string {
    return this._issueService.getDataSetSupportEmail();
  }

  getHighLevelImpact(): string[] {
    return this._issueService.getHighLevelImpact();
  }

  getStepClasses(step: number) {
    return {
      'create-issue__form-step--previous': step < this.currentStep,
      'create-issue__form-step--current': step == this.currentStep,
      'create-issue__form-step--next': step > this.currentStep,
    }
  }

  readjustParentHeight(delay: number = 400) {
    setTimeout(() => {
      this.setParentHeight();
    }, delay);
  }

  private init() {

    this.formSteps = [
      {
        title: 'Contact',
        colour: '#baddff'
      },
      {
        title: 'Issue',
        colour: '#9dcfff'
      },
      {
        title: 'Function',
        colour: '#50a9ff'
      },
      {
        title: 'Business impact',
        colour: '#0383ff'
      },
      {
        title: 'Complete',
        colour: '#025bb2'
      }
    ];

    if (this.isEditForm) {
      this.formSteps.push({
        title: 'BI Step 1',
        colour: '#124373'
      });

      this.formSteps.push({
        title: 'BI Step 2',
        colour: '#0a2c4c'
      });
    }

    this.currentStep = 1;

    // Check and set if draft has been saved previously
    let savedDraft = this._issueService.getSavedDraft();

    if (_.isEmpty(savedDraft)) {
      this.userResponse = new CreateIssueModel();

    } else {
      this.userResponse = savedDraft;
      this.currentStep = _.get(this.userResponse, 'currentStep', 1);
      console.log('%c lg: savedDraft: ', 'background: #222; color: #bada55', savedDraft);

      setTimeout(() => {
        this._userAlertService.showToasterMessage('Loaded previously saved draft');
      }, 450);
    }

    setTimeout(() => {
      this.setParentHeight();
    }, 400);

  }

  private nextStep() {
    this.onStepChange(this.currentStep + 1);
  }

  private previousStep() {
    this.onStepChange(this.currentStep - 1);
  }

  private setParentHeight() {
    let currentChildHeight = this.getCurrentChild().nativeElement.offsetHeight;
    const marginOfError: number = 25;
    this.parentHeight = `${currentChildHeight + marginOfError}px`;
  }

  private getCurrentChild(): ElementRef {
    switch (this.currentStep) {
      case 1:
        return this.jqChild1;
      case 2:
        return this.jqChild2;
      case 3:
        return this.jqChild3;
      case 4:
        return this.jqChild4;
      case 5:
        return this.jqChild5;
      default:
        return this.jqChild1;
    }
  }

  private scrollToTop() {
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 10);
  }

}
