const quote = (cmd: TemplateStringsArray, ...args: Array<string | number>) => {
  return cmd.reduce((acc, cur, i) => {
    return acc + cur + (args[i] || "");
  }, "");
};

const parseArgsStringToArgv = (
  value: string,
  env?: string,
  file?: string
): string[] => {
  const myRegexp =
    /([^\s'"]([^\s'"]*(['"])([^\3]*?)\3)+[^\s'"]*)|[^\s'"]+|(['"])([^\5]*?)\5/gi;
  const myString = value;
  const myArray: string[] = [];
  if (env) {
    myArray.push(env);
  }
  if (file) {
    myArray.push(file);
  }
  let match: RegExpExecArray | null;
  do {
    match = myRegexp.exec(myString);
    if (match !== null) {
      myArray.push(firstString(match[1], match[6], match[0])!);
    }
  } while (match !== null);

  return myArray;
};

const firstString = (...args: Array<any>): string | undefined => {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (typeof arg === "string") {
      return arg;
    }
  }
};

type CommandOutput = {
  stdout: string;
  stderr: string;
  exitCode: number;
};

const exec = async (c: string): Promise<CommandOutput> => {
  const args = parseArgsStringToArgv(c);
  const out = await runjs.spawn(args[0], args.slice(1));
  return {
    stdout: out.stdout,
    stderr: out.stderr,
    exitCode: out.exitCode,
  };
};

const execWrapper = async (cmd: TemplateStringsArray | string) => {
  if (typeof cmd === "string") {
    return await exec(cmd);
  } else {
    return await exec(quote(cmd));
  }
};

export const $ = async (cmd: TemplateStringsArray | string) => {
  const output = await execWrapper(cmd);
  return output.stdout;
};
