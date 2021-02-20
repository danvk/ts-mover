# ts-mover

Utility for moving and renaming files in a TypeScript project.

See [this Stack Overflow question][1] for background and motivation.

To get going, create a file containing the path to your tsconfig.json followed by a list of moves you'd like to do:

    $ cat moves.txt
    /path/to/project/tsconfig.json
    src/oldname.ts --> src/newname.ts
    src/file.ts --> src/newmodule/file.ts
    src/file2.ts --> src/newmodule/

Then run `ts-mover` on this file:

    npx ts-mover moves.txt

And you're good to go! Moves are only committed to disk once they all succeed.

## Development

    $ yarn
    $ yarn tsc

To test:

    $ yarn tsc
    $ node dist/index.js moves.sample.txt
    Initializing project tsconfig.json
    Project source files:
    src/index.ts

    Moving src/index.ts --> src/mover.ts
      (Be patient, the first move takes the longest.)
      elapsed: 455 ms
    Saving changes to disk...

    $ git status
    	deleted:    src/index.ts

      Untracked files:
        (use "git add <file>..." to include in what will be committed)
        src/mover.ts

[1]: https://stackoverflow.com/questions/65970569/reorganize-large-typescript-project-from-the-command-line
