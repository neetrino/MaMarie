'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from '../../lib/i18n-client';
import { CheckoutForm } from './CheckoutForm';
import { CheckoutModals } from './CheckoutModals';
import { CheckoutPageShell, checkoutPageShellStyles } from './components/CheckoutPageShell';
import { CheckoutPrimaryButton } from './components/CheckoutPrimaryButton';
import { CHECKOUT_PAGE_TITLE_CLASS, CHECKOUT_SECTION_CARD_CLASS } from './constants/checkout-ui';
import { OrderSummary } from './OrderSummary';
import { useCheckout } from './useCheckout';

function CheckoutSkeleton() {
  return (
    <CheckoutPageShell>
      <div className={checkoutPageShellStyles.titleOffset}>
        <div className="h-8 w-40 animate-pulse rounded-lg bg-gray-200" />
      </div>
      <div className={`grid grid-cols-1 lg:grid-cols-3 ${checkoutPageShellStyles.formGrid}`}>
        <div className={`lg:col-span-2 ${checkoutPageShellStyles.formSections} flex flex-col`}>
          <div className={`${CHECKOUT_SECTION_CARD_CLASS} h-64 animate-pulse bg-gray-100`} />
          <div className={`${CHECKOUT_SECTION_CARD_CLASS} h-48 animate-pulse bg-gray-100`} />
        </div>
        <div className={`${CHECKOUT_SECTION_CARD_CLASS} h-72 animate-pulse bg-gray-100`} />
      </div>
    </CheckoutPageShell>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const {
    cart,
    loading,
    error,
    setError,
    currency,
    logoErrors,
    setLogoErrors,
    showShippingModal,
    setShowShippingModal,
    showCardModal,
    setShowCardModal,
    deliveryPrice,
    loadingDeliveryPrice,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    setValue,
    paymentMethod,
    shippingMethod,
    shippingCity,
    paymentMethods,
    orderSummary,
    handlePlaceOrder,
    onSubmit,
    isLoggedIn,
  } = useCheckout();

  if (loading) {
    return <CheckoutSkeleton />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <CheckoutPageShell>
        <h1 className={`${CHECKOUT_PAGE_TITLE_CLASS} ${checkoutPageShellStyles.titleOffset}`}>
          {t('checkout.title')}
        </h1>
        <div className={`${CHECKOUT_SECTION_CARD_CLASS} text-center`}>
          <p className="mb-5 text-gray-600">{t('checkout.errors.cartEmpty')}</p>
          <CheckoutPrimaryButton type="button" onClick={() => router.push('/products')}>
            {t('checkout.buttons.continueShopping')}
          </CheckoutPrimaryButton>
        </div>
      </CheckoutPageShell>
    );
  }

  return (
    <CheckoutPageShell>
      <h1 className={`${CHECKOUT_PAGE_TITLE_CLASS} ${checkoutPageShellStyles.titleOffset}`}>
        {t('checkout.title')}
      </h1>

      <form onSubmit={handlePlaceOrder}>
        <div className={`grid grid-cols-1 lg:grid-cols-3 ${checkoutPageShellStyles.formGrid}`}>
          <CheckoutForm
            register={register}
            setValue={setValue}
            shippingCity={shippingCity}
            errors={errors}
            isSubmitting={isSubmitting}
            shippingMethod={shippingMethod}
            paymentMethod={paymentMethod}
            paymentMethods={paymentMethods}
            logoErrors={logoErrors}
            setLogoErrors={setLogoErrors}
            error={error}
            setError={setError}
          />

          <OrderSummary
            orderSummary={orderSummary}
            currency={currency}
            shippingMethod={shippingMethod}
            shippingCity={shippingCity}
            loadingDeliveryPrice={loadingDeliveryPrice}
            deliveryPrice={deliveryPrice}
            error={error}
            isSubmitting={isSubmitting}
            onPlaceOrder={(e) => {
              if (e) {
                handlePlaceOrder(e);
              } else {
                handlePlaceOrder({ preventDefault: () => {} } as React.FormEvent);
              }
            }}
          />
        </div>
      </form>

      <CheckoutModals
        showShippingModal={showShippingModal}
        setShowShippingModal={setShowShippingModal}
        showCardModal={showCardModal}
        setShowCardModal={setShowCardModal}
        register={register}
        setValue={setValue}
        handleSubmit={handleSubmit}
        errors={errors}
        isSubmitting={isSubmitting}
        shippingMethod={shippingMethod}
        paymentMethod={paymentMethod}
        shippingCity={shippingCity}
        cart={cart}
        orderSummary={orderSummary}
        currency={currency}
        loadingDeliveryPrice={loadingDeliveryPrice}
        deliveryPrice={deliveryPrice}
        logoErrors={logoErrors}
        setLogoErrors={setLogoErrors}
        isLoggedIn={isLoggedIn}
        onSubmit={onSubmit}
      />
    </CheckoutPageShell>
  );
}
