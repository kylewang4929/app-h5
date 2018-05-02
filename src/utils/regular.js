
const phone = /^(\d)+$/;
const email = /^((\w-*\.*)+@(\w-?)+(\.\w{2,})+)/;
const phoneAndEmail = /^((\w-*\.*)+@(\w-?)+(\.\w{2,})+)|(\d)+$/;
const password = /^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{8,20}$/;
export default {
  phone,
  email,
  phoneAndEmail,
  password,
};
