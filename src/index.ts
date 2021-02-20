import * as fs from 'fs';
import path from 'path';
import {Project} from 'ts-morph';

const [, , commandsFile] = process.argv;

const [tsConfigFilePath, ...movesRaw] = fs.readFileSync(commandsFile, 'utf-8').split('\n');
console.log('Initializing project', tsConfigFilePath);
const project = new Project({
  tsConfigFilePath,
});
const root = project.getRootDirectories()[0];
const rootDir = root.getPath();

console.log('Project source files:');
for (const sourceFile of project.getSourceFiles()) {
  console.log(root.getRelativePathTo(sourceFile));
}
console.log('');

function tuple<Args extends any[]>(...args: Args): Args {
  return args;
}

const moves = movesRaw.filter(x => !!x).map(moveRaw => {
  const parts = moveRaw.split(/ *--?> */);
  if (parts.length !== 2) {
    throw new Error(`Invalid move: ${moveRaw}`);
  }
  return tuple(parts[0], parts[1]);
});

let isFirst = true;
for (const [before, after] of moves) {
  const isAfterDir = !/\.tsx?$/.exec(after);
  const startMs = Date.now();
  console.log('Moving', before, '-->', after + (isAfterDir ? '/' + path.basename(before) : ''));
  if (isFirst) {
    console.log('  (Be patient, the first move takes the longest.)');
    isFirst = false;
  }
  const source = root.getSourceFileOrThrow(before);
  const afterPath = path.join(rootDir, after);
  if (isAfterDir) {
    source.moveToDirectory(afterPath);
  } else {
    source.move(afterPath);
  }
  console.log('  elapsed:', Date.now() - startMs, 'ms');
}

(async () => {
  console.log('Saving changes to disk...');
  await project.save();
})();
