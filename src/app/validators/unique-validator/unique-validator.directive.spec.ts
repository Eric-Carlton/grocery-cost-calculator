import { UniqueValidator } from './unique-validator.directive';

describe('CustomValidatorDirective', () => {
  it('should create an instance', () => {
    const directive = new UniqueValidator();
    expect(directive).toBeTruthy();
  });
});
