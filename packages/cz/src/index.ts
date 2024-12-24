interface Props {
  a: number;
  b: string;
}

const obj: Props = {
  a: 1,
  b: "2",
};

console.log(obj);

export const func = () => {
  return obj.a + obj.b;
};
