// src/components/Purchase/OrderSummary.jsx
import React, { useMemo } from "react";
import { formatARS } from "../../utils/money";

export default function OrderSummary({ plan, billing="monthly", coupon=null, taxes=0.21, onRemoveCoupon }) {
  const base = billing === "monthly" ? plan.priceMonthly : (plan.priceMonthly * 10);
  const discount = useMemo(() => {
    if (!coupon) return 0;
    return coupon.type === "percent" ? base * (coupon.value/100) : coupon.value;
  }, [coupon, base]);

  const subtotal = Math.max(0, base - discount);
  const iva = subtotal * taxes;
  const total = subtotal + iva;

  return (
    <div className="os">
      <div className="osRow osHead">
        <div className="osTitle">{plan.name} <span className="osBadge">{billing === "monthly" ? "Mensual" : "Anual"}</span></div>
        <div className="osAmount">{formatARS(base)}</div>
      </div>

      {coupon && (
        <div className="osRow">
          <div className="osCoupon">
            Cupón <strong>{coupon.code}</strong>
            {onRemoveCoupon && (
              <button className="osRemove" onClick={onRemoveCoupon} title="Quitar cupón">Quitar</button>
            )}
          </div>
          <div className="osAmount osDiscount">- {formatARS(discount)}</div>
        </div>
      )}

      <div className="osSep" />

      <div className="osRow">
        <div className="osLabel">Subtotal</div>
        <div className="osAmount">{formatARS(subtotal)}</div>
      </div>
      <div className="osRow">
        <div className="osLabel">Impuestos (IVA 21%)</div>
        <div className="osAmount">{formatARS(iva)}</div>
      </div>

      <div className="osSep" />

      <div className="osRow osTotal">
        <div className="osLabel">Total hoy</div>
        <div className="osAmount">{formatARS(total)}</div>
      </div>

      <p className="osHelp">Renovación automática mensual. Podés cancelar cuando quieras.</p>
    </div>
  );
}
