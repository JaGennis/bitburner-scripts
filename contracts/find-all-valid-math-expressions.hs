#!/usr/bin/env runhaskell
import Data.List
import System.Environment ( getArgs )
import Data.Char ( isDigit )
import Control.Arrow

ps :: [[[Int]]]
ps = [] : map parts [1..]
    where parts n = [n] : [x : p | x <- [1..n], p <- ps !! (n - x), x <= head p]

consume :: [Int] -> [a] -> [[a]]
consume []    l  = []
consume l     [] = []
consume steps l  = take (head steps) l : consume (drop 1 steps) (drop (head steps) l)

permutateOrder :: [a] -> [[[a]]]
permutateOrder elements = map (\x -> consume x elements) (nub $ concatMap permutations $ ps !! length elements)

mathOps = ['+', '-', '*']

rofl :: [Char] -> String -> [Int] -> [String]
rofl ops str [] = []
rofl ops str [x] = [str ++ show x]
rofl ops "" (x:xs:xss) = concatMap (\f -> rofl ops (show x ++ [f] ++ show xs) xss) ops
rofl ops str (x:xs) = concatMap (\f -> rofl ops (str ++ [f] ++ show x) xs) ops

data Token = Number Int | Plus | Minus | Multiply
    deriving (Show, Eq)

lexer :: String -> [Token]
lexer "" = []
lexer ('+':str) = Plus : lexer str
lexer ('-':str) = Minus : lexer str
lexer ('*':str) = Multiply : lexer str
lexer str = Number (read $ takeWhile isDigit str) : lexer (dropWhile isDigit str)

eval :: [Token] -> Int
eval [] = 0
eval [Number n] = n
eval str
    | elem Multiply str = eval $ init front ++ [ Number (fac1 * fac2) ] ++ tail back
    | otherwise = eval $ Number (op firstNumber secondNumber) : drop 3 str
    where (front,_:back) = break (== Multiply) str
          Number fac1 = last front
          Number fac2 = head back
          op = case str !! 1 of
            Plus -> (+)
            Minus -> (-)
          Number firstNumber = head str
          Number secondNumber = str !! 2

main = do
    (digits, _:target) <- break (==',') . filter (\x -> x /= '[' && x /= ']' && x /= '"') . head <$> getArgs
    --let calcs = concatMap (rofl mathOps "" . map read) $ permutateOrder digits
    let calcs = concatMap (rofl mathOps "" . map read) $ permutateOrder digits
    putStrLn $ filter (/= '"') $ show $ map (calcs !!) $ elemIndices (read target) $ map (eval.lexer) calcs
    --putStrLn $ filter (/= '"') $ show $ map (calcs !!) $ first (elemIndices (read target) $ map (eval.lexer)) (calcs,calcs)
