import React from 'react';
import { Player } from './player';

interface SquareProps {
    value: Player;
    onClick: () => void;
}

export function Square(props: SquareProps) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}