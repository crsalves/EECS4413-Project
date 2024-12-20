import { Payment } from './Payment';

export class PaymentModel implements Payment {
	paymentId: number;
	orderId: number;
	userId: number;
	userPaymentId: number;
	amount: number;
	paymentStatus: string;
	paymentMethod: string;
	type: string;
	cardNumber: string;
	expireDate: string;
	securityCode: string;
	createdAt: Date;
	updatedAt: Date;

	constructor(
		paymentId: number,
		orderId: number,
		userId: number,
		userPaymentId: number,
		amount: number,
		paymentStatus: string,
		paymentMethod: string,
		type: string,
		cardNumber: string,
		expireDate: string,
		securityCode: string,
		createdAt: Date,
		updatedAt: Date
	) {
		this.paymentId = paymentId;
		this.orderId = orderId;
		this.userId = userId;
		this.userPaymentId = userPaymentId;
		this.amount = amount;
		this.paymentStatus = paymentStatus;
		this.paymentMethod = paymentMethod;
		this.type = type;
		this.cardNumber = cardNumber;
		this.expireDate = expireDate;
		this.securityCode = securityCode;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	// Getters
	get getPaymentId(): number {
		return this.paymentId;
	}

	get getOrderId(): number {
		return this.orderId;
	}

	get getUserId(): number {
		return this.userId;
	}

	get getUserPaymentId(): number {
		return this.userPaymentId;
	}

	get getAmount(): number {
		return this.amount;
	}

	get getPaymentStatus(): string {
		return this.paymentStatus;
	}

	get getPaymentMethod(): string {
		return this.paymentMethod;
	}

	get getType(): string {
		return this.type;
	}

	get getCardNumber(): string {
		return this.cardNumber;
	}

	get getExpireDate(): string {
		return this.expireDate;
	}

	get getSecurityCode(): string {
		return this.securityCode;
	}

	get getCreatedAt(): Date {
		return this.createdAt;
	}

	get getUpdatedAt(): Date {
		return this.updatedAt;
	}

	// Setters
	set setPaymentId(value: number) {
		this.paymentId = value;
	}

	set setOrderId(value: number) {
		this.orderId = value;
	}

	set setUserId(value: number) {
		this.userId = value;
	}

	set setUserPaymentId(value: number) {
		this.userPaymentId = value;
	}

	set setAmount(value: number) {
		this.amount = value;
	}

	set setPaymentStatus(value: string) {
		this.paymentStatus = value;
	}

	set setPaymentMethod(value: string) {
		this.paymentMethod = value;
	}

	set setType(value: string) {
		this.type = value;
	}

	set setCardNumber(value: string) {
		this.cardNumber = value;
	}

	set setExpireDate(value: string) {
		this.expireDate = value;
	}

	set setSecurityCode(value: string) {
		this.securityCode = value;
	}

	set setCreatedAt(value: Date) {
		this.createdAt = value;
	}

	set setUpdatedAt(value: Date) {
		this.updatedAt = value;
	}

	// String Representation
	public toString(): string {
		return `PaymentModel {
      paymentId: ${this.paymentId},
      orderId: ${this.orderId},
      userId: ${this.userId},
      userPaymentId: ${this.userPaymentId},
      amount: ${this.amount},
      paymentStatus: ${this.paymentStatus},
      paymentMethod: ${this.paymentMethod},
      type: ${this.type},
      cardNumber: ${this.cardNumber},
      expireDate: ${this.expireDate},
      securityCode: ${this.securityCode},
      createdAt: ${this.createdAt.toISOString()},
      updatedAt: ${this.updatedAt.toISOString()}
    }`;
	}
}
