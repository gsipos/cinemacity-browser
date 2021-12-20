import React from 'react'
import styled from 'styled-components'

interface Props {
  name: string
  toggle: () => void
  active: boolean
}

const Chip = styled.div`
  padding: 2px 8px;
  margin: 2px;
  border: 1px solid #131313;
  width: fit-content;
  cursor: pointer;

  background-color: transparent;
  color: black;

  display: flex;
  align-items: center;
  width: 100%;
`

const ActiveChip = styled(Chip)`
  background-color: black;
  color: white;
`

export const AttributeFilter = (props: Props) =>
  props.active ? (
    <ActiveChip onClick={props.toggle}>{props.name}</ActiveChip>
  ) : (
    <Chip onClick={props.toggle}>{props.name}</Chip>
  )

export const AttributeFilterContainer = styled.div`
  display: grid;
  padding: 16px;
  width: 100%;
  grid-template-columns: repeat(auto-fit, 120px);
  justify-items: center;
  grid-gap: 8px;
`
