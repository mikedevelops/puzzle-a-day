export type Matrix<T> = T[][];

export function transpose<T>(matrix: Matrix<T>): Matrix<T> {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const result = [];

  for (let j = 0; j < cols; j++) {
    const newRow = [];
    for (let i = 0; i < rows; i++) {
      newRow.push(matrix[i][j]);
    }
    result.push(newRow);
  }

  return result;
}

export function flipHorizontally<T>(matrix: Matrix<T>): Matrix<T> {
  return matrix.map((row) => row.reverse());
}

export function flipVertically<T>(matrix: Matrix<T>): Matrix<T> {
  return matrix.reverse();
}

export enum Axis {
  X,
  Y,
}

export function inverse<T>(matrix: Matrix<T>, axis: Axis): Matrix<T> {
  switch (axis) {
    case Axis.X:
      return matrix.reverse();
    case Axis.Y:
      return matrix.map((row) => row.reverse());
  }

  return matrix;
}
