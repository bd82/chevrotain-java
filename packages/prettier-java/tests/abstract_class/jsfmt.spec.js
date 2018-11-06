const prettier = require("prettier");
const { expect } = require("chai");

describe("prettier-java", () => {
  const input = `
public abstract class   AbstractClass {

  abstract public 
  void abstractMethod();

  public void method (   ) {
    System.out.print("method");
  }

}`;

  const expectedOutput = `public abstract class AbstractClass {

  abstract public void abstractMethod();

  public void method() {
    System.out.print("method");
  }

}

`;

  it("can format", () => {
    const actual = prettier.format(input, {
      parser: "java",
      plugins: ["./packages/prettier-java"]
    });

    expect(actual).to.deep.equal(expectedOutput);
  });
});
