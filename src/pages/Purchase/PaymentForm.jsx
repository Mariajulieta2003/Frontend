import React, { useMemo, useState } from "react";
import "./styles/PaymentForm.css";

const BANK_INSTALLMENTS = [
  { value: "1", label: "1 cuota (sin interés)" },
  { value: "3", label: "3 cuotas" },
  { value: "6", label: "6 cuotas" },
  { value: "12", label: "12 cuotas" },
];

export default function PaymentForm({ onSubmit, loading }) {
  const [data, setData] = useState({
    cardNumber: "",
    holder: "",
    docType: "DNI",
    docNumber: "",
    expMonth: "",
    expYear: "",
    cvv: "",
    installments: "1",
    email: "",
  });

  const valid = useMemo(() => {
    // Validación básica tipo MP (front)
    const nn = (s) => String(s || "").trim();
    return (
      nn(data.cardNumber).replaceAll(" ", "").length >= 15 &&
      nn(data.holder).length >= 3 &&
      nn(data.docNumber).length >= 6 &&
      /^\d{2}$/.test(nn(data.expMonth)) &&
      /^\d{2}$/.test(nn(data.expYear)) &&
      /^\d{3,4}$/.test(nn(data.cvv)) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nn(data.email))
    );
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let v = value;
    // formatos mínimos
    if (name === "cardNumber") {
      v = value
        .replace(/[^\d]/g, "")
        .slice(0, 19)
        .replace(/(\d{4})(?=\d)/g, "$1 ");
    }
    if (name === "expMonth") v = value.replace(/[^\d]/g, "").slice(0, 2);
    if (name === "expYear") v = value.replace(/[^\d]/g, "").slice(0, 2);
    if (name === "cvv") v = value.replace(/[^\d]/g, "").slice(0, 4);
    if (name === "docNumber") v = value.replace(/[^\d]/g, "").slice(0, 12);

    setData((p) => ({ ...p, [name]: v }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!valid || loading) return;
    onSubmit?.(data);
  };

  return (
    <form className="mpForm" onSubmit={submit}>
      {/* Tarjeta */}
      <div className="card">
        <div className="cardTop">
          <div className="chip" />
          <div className="networks">
            <span className="net net-visa">VISA</span>
            <span className="net net-mc">MC</span>
            <span className="net net-am">AMEX</span>
          </div>
        </div>
        <div className="cardNumber">{data.cardNumber || "#### #### #### ####"}</div>
        <div className="cardBottom">
          <div className="holder">{data.holder || "NOMBRE Y APELLIDO"}</div>
          <div className="expires">
            {data.expMonth || "MM"}/{data.expYear || "AA"}
          </div>
        </div>
      </div>

      <div className="fieldRow">

          {/* Íconos de tarjetas  */}
          <div className="cardBrands">
            <span className="net-icon net-visa"></span>
            <span className="net-icon net-mc"></span>
            <span className="net-icon net-am"></span>
          </div>

        <label>Número de tarjeta</label>
        <input
          name="cardNumber"
          inputMode="numeric"
          placeholder="1234 5678 9012 3456"
          value={data.cardNumber}
          onChange={handleChange}
          autoComplete="cc-number"
        />
      </div>

      <div className="twoCols">
        <div className="fieldRow">
          <label>Nombre y apellido</label>
          <input
            name="holder"
            placeholder="Como figura en la tarjeta"
            value={data.holder}
            onChange={handleChange}
            autoComplete="cc-name"
          />
        </div>

        <div className="fieldRow">
          <label>Documento</label>
          <div className="docRow">
            <select name="docType" value={data.docType} onChange={handleChange}>
              <option value="DNI">DNI</option>
              <option value="LC">LC</option>
              <option value="LE">LE</option>
            </select>
            <input
              name="docNumber"
              inputMode="numeric"
              placeholder="12345678"
              value={data.docNumber}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="threeCols">
        <div className="fieldRow">
          <label>Vencimiento</label>
          <div className="expRow">
            <input
              name="expMonth"
              inputMode="numeric"
              placeholder="MM"
              value={data.expMonth}
              onChange={handleChange}
              autoComplete="cc-exp-month"
            />
            <span>/</span>
            <input
              name="expYear"
              inputMode="numeric"
              placeholder="AA"
              value={data.expYear}
              onChange={handleChange}
              autoComplete="cc-exp-year"
            />
          </div>
        </div>

        <div className="fieldRow">
          <label>CVV</label>
          <input
            name="cvv"
            inputMode="numeric"
            placeholder="123"
            value={data.cvv}
            onChange={handleChange}
            autoComplete="cc-csc"
          />
        </div>

        <div className="fieldRow">
          <label>Cuotas</label>
          <select
            name="installments"
            value={data.installments}
            onChange={handleChange}
          >
            {BANK_INSTALLMENTS.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="fieldRow">
        <label>Email</label>
        <input
          name="email"
          placeholder="tu@email.com"
          value={data.email}
          onChange={handleChange}
          autoComplete="email"
        />
      </div>

      <button type="submit" className="payBtn" disabled={!valid || loading}>
        {loading ? "Procesando..." : "Pagar"}
      </button>
    </form>
  );
}
