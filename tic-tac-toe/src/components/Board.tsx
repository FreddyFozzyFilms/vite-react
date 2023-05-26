import * as React from 'react';

interface BoardProps {
  mat: number[][];
  onChange: (row: number, col: number) => void;
}
export default function Board(props: BoardProps) {
  const { mat, onChange } = props;

  const repr = (elem) => {
    if (elem == -1) return '';
    return elem == 1 ? 'x' : 'o';
  };

  return (
    <div>
      {mat.map((row, rindex) => (
        <div key={rindex} className="board-row">
          {row.map((elem, eindex) => (
            <button
              key={eindex}
              className={`square ${rindex == 0 && 'no-top'} ${
                eindex == 0 && 'no-left'
              } no-bottom no-right`}
              onClick={() => onChange(rindex, eindex)}
            >
              {repr(elem)}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
